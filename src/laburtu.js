const API_ROOT = 'https://labur.eus/api/v2';
const API_SHORTEN = `${API_ROOT}/action/shorten`;

const URL_CACHE = {};

// Default API key.
let api_key = '169fc94bfdd75d7268a20c0cf8b600';

let currentTab = null;

function getApiKeyFromStorage() {
    // If available use the API key of the user instead of the default one.
    chrome.storage.sync.get("api-key", function(result) {

        if (result && result["api-key"] !== undefined && result["api-key"] !== "") {

            api_key = result["api-key"];
        }
    });
}

getApiKeyFromStorage();

function onContextMenuItemCreated(n) {
    if (chrome.runtime.lastError) {
        console.log(`Error: ${chrome.runtime.lastError}`);
    }
}


/*
Create the context menu item.
chrome.contextMenus is not defined in Firefox for Android (May 2017)
*/
chrome.contextMenus && chrome.contextMenus.create({
    id: "laburtu-eus",
    title: 'Laburtu URL hau',
    contexts: ["link"]
}, onContextMenuItemCreated);

/*
The click event listener, where we perform the appropriate action given the
ID of the menu item that was clicked.
chrome.contextMenus is not defined in Firefox for Android (May 2017)
*/
chrome.contextMenus && chrome.contextMenus.onClicked.addListener(function(info, tab) {
    switch (info.menuItemId) {
        case "laburtu-eus":
            const url = info.linkUrl;

            let shortenedUrl;

            if (URL_CACHE.hasOwnProperty(url)) {

                shortenedUrl = URL_CACHE[url];

                chrome.storage.sync.set({
                    "shortened-url": shortenedUrl
                });

                chrome.tabs.executeScript(tab.id, {
                    file: "clipboard-helper.js",
                });

                showBasicNotification(`Helbidea arbelean kopiatu da: ${shortenedUrl}`);

            } else {

                getShortenedUrl(url, function(shortenedUrl) {

                    URL_CACHE[url] = shortenedUrl;

                    chrome.storage.sync.set({
                        "shortened-url": shortenedUrl
                    });

                    chrome.tabs.executeScript(tab.id, {
                        file: "clipboard-helper.js",
                    });

                    showBasicNotification(`Helbidea arbelean kopiatu da: ${shortenedUrl}`);

                }, function(errorMessage) {
                    console.log(errorMessage);
                });
            }

            break;
    }
});

function showBasicNotification(message) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/laburtu-96.png",
        title: "Laburtu.eus",
        message: message
    });
}

function getShortenedUrl(url, callback, errorCallback) {
    const params = param({
        url: url,
        key: api_key
    });

    var requestUrl = `${API_SHORTEN}?${params}`;

    var x = new XMLHttpRequest();
    x.open('GET', requestUrl);
    x.responseType = 'text';
    x.onload = function() {
        var shortenedUrl = x.response;

        if (!shortenedUrl || x.status !== 200) {
          errorCallback('No response from Polr or an error happened!');
          return;
        }
        callback(shortenedUrl);
    };
    x.onerror = function() {
        errorCallback('Network error.');
    };
    x.send();
}

function param(obj) {
    return Object.keys(obj).map(
        k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`
    ).join('&');
}


function handleUpdateActiveTab() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        currentTab = tabs[0];
        /*if (!currentTab || (currentTab && !currentTab.url.startsWith('http'))) {
            return;
        }
        chrome.pageAction.show(currentTab.id);*/
    });
}
chrome.tabs.onUpdated.addListener(handleUpdateActiveTab);
chrome.tabs.onActivated.addListener(handleUpdateActiveTab);


function handleMessage(message, sender, sendResponse) {

    if (message.from === "content" && message.subject === "getUrl") {

        console.log(message.url);

        if (URL_CACHE.hasOwnProperty(message.url)) {

            sendResponse(URL_CACHE[message.url]);

            return;
        }

        getShortenedUrl(message.url, function(shortenedUrl) {

            URL_CACHE[message.url] = shortenedUrl;

            sendResponse(shortenedUrl);

        }, function(errorMessage) {
            console.log(errorMessage);
        });

        return true; // indicates an async response

    } else if ((message.from === "popup") && message.subject === "getUrl") {
        const {
            url
        } = currentTab;

        if (URL_CACHE.hasOwnProperty(url)) {

            chrome.storage.sync.set({
                "shortened-url": URL_CACHE[url]
            });

            chrome.tabs.executeScript(currentTab.id, {
                file: "clipboard-helper.js",
            });

            showBasicNotification(`Helbidea arbelean kopiatu da: ${URL_CACHE[url]}`);

            sendResponse(URL_CACHE[url]);

            return;
        }

        getShortenedUrl(url, function(shortenedUrl) {

            URL_CACHE[url] = shortenedUrl;

            chrome.storage.sync.set({
                "shortened-url": shortenedUrl
            });

            chrome.tabs.executeScript(currentTab.id, {
                file: "clipboard-helper.js",
            });

            showBasicNotification(`Helbidea arbelean kopiatu da: ${shortenedUrl}`);

            sendResponse(shortenedUrl);

        }, function(errorMessage) {
            console.log(errorMessage);
        });

        return true; // indicates an async response

    } else if (message.from === "options" && message.subject === "updateApiKey") {

        getApiKeyFromStorage();

        sendResponse(true);

        return true;

    } else {

        return;

    }
}
chrome.runtime.onMessage.addListener(handleMessage);

handleUpdateActiveTab(); // Initial load
