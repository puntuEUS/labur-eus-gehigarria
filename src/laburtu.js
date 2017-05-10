const API_ROOT = 'https://labur.eus/api/v2';
const API_KEY = '169fc94bfdd75d7268a20c0cf8b600';
const API_SHORTEN = `${API_ROOT}/action/shorten`;

const URL_CACHE = {};

let currentTab = null;


function param(obj) {
  return Object.keys(obj).map(
    k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`
  ).join('&');
}


function updateTab(tabs) {
  currentTab = tabs[0];
  if (!currentTab || (currentTab && !currentTab.url.startsWith('http'))) {
    return;
  }
  browser.pageAction.show(currentTab.id);
}


function handleUpdateActiveTab() {
  browser.tabs
    .query({ active: true, currentWindow: true })
    .then(updateTab);
}
browser.tabs.onUpdated.addListener(handleUpdateActiveTab);
browser.tabs.onActivated.addListener(handleUpdateActiveTab);


function handleMessage(message, sender, sendResponse) {
  if (message.from !== 'popup' || message.subject !== 'getUrl') {
    return;
  }

  const { url } = currentTab;
  if (URL_CACHE.hasOwnProperty(url)) {
    sendResponse(URL_CACHE[url]);
    return;
  }

  const params = param({ url, key: API_KEY });
  fetch(`${API_SHORTEN}?${params}`)
    .then(response => response.text())
    .then(shortUrl => {
      URL_CACHE[url] = shortUrl;
      sendResponse(shortUrl);
    });

  return true;  // indicates an async response
}
browser.runtime.onMessage.addListener(handleMessage);


handleUpdateActiveTab();  // Initial load
