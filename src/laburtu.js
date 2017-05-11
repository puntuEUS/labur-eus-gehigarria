const API_ROOT = 'https://labur.eus/api/v2';
const API_KEY = '169fc94bfdd75d7268a20c0cf8b600';
const API_SHORTEN = `${API_ROOT}/action/shorten`;

const URL_CACHE = {};

let currentTab = null;


function onContextMenuItemCreated(n) {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    } else {
        console.log("Item created successfully");
    }
}


/*
Create the context menu item.
*/
browser.contextMenus.create({
    id: "laburtu-eus",
    title: 'Laburtu URL hau',
    contexts: ["link"]
}, onContextMenuItemCreated);

function copyToClipboard(tab, url) {
    // Since background pages cannot directly write to the clipboard,
    // we will run a content script that copies the actual content.

    // clipboard-helper.js defines function copyToClipboard.
    const code = "copyToClipboard(" + JSON.stringify(url) + ");"

    browser.tabs.executeScript({
        code: "typeof copyToClipboard === 'function';",
    }).then(function(results) {
        // The content script's last expression will be true if the function
        // has been defined. If this is not the case, then we need to run
        // clipboard-helper.js to define function copyToClipboard.
        if (!results || results[0] !== true) {
            return browser.tabs.executeScript(tab.id, {
                file: "clipboard-helper.js",
            });
        }
    }).then(function() {
        return browser.tabs.executeScript(tab.id, {
            code,
        });
    }).catch(function(error) {
        // This could happen if the extension is not allowed to run code in
        // the page, for example if the tab is a privileged page.
        console.error("Failed to copy text: " + error);
    });
}

/*
The click event listener, where we perform the appropriate action given the
ID of the menu item that was clicked.
*/
browser.contextMenus.onClicked.addListener(function(info, tab) {
    switch (info.menuItemId) {
        case "laburtu-eus":
            const url = info.linkUrl;

            let shortenedUrl;

            if (URL_CACHE.hasOwnProperty(url)) {
                shortenedUrl = URL_CACHE[url];
                copyToClipboard(tab, shortenedUrl);
                break;
            }

            const params = param({
                url,
                key: API_KEY
            });
            fetch(`${API_SHORTEN}?${params}`)
                .then(response => response.text())
                .then(shortUrl => {
                    URL_CACHE[url] = shortUrl;
                    copyToClipboard(tab, shortUrl);
                });

            break;
    }
});


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
        .query({
            active: true,
            currentWindow: true
        })
        .then(updateTab);
}
browser.tabs.onUpdated.addListener(handleUpdateActiveTab);
browser.tabs.onActivated.addListener(handleUpdateActiveTab);


function handleMessage(message, sender, sendResponse) {
    if (message.from !== 'popup' || message.subject !== 'getUrl') {
        return;
    }

    const {
        url
    } = currentTab;
    if (URL_CACHE.hasOwnProperty(url)) {
        sendResponse(URL_CACHE[url]);
        return;
    }

    const params = param({
        url,
        key: API_KEY
    });
    fetch(`${API_SHORTEN}?${params}`)
        .then(response => response.text())
        .then(shortUrl => {
            URL_CACHE[url] = shortUrl;
            sendResponse(shortUrl);
        });

    return true; // indicates an async response
}
browser.runtime.onMessage.addListener(handleMessage);

handleUpdateActiveTab(); // Initial load
