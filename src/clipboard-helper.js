// This function must be called in a visible page, such as a chromeAction popup
// or a content script. Calling it in a background page has no effect!
// https://github.com/mdn/webextensions-examples/blob/master/context-menu-copy-link-with-types/background.js
// License: Mozilla Public License 2.0 https://github.com/mdn/webextensions-examples/blob/master/LICENSE
function copyToClipboard(text) {
    function oncopy(event) {
        document.removeEventListener("copy", oncopy, true);
        // Hide the event from the page to prevent tampering.
        event.stopImmediatePropagation();

        // Overwrite the clipboard content.
        event.preventDefault();
        event.clipboardData.setData("text/plain", text);
    }
    document.addEventListener("copy", oncopy, true);

    // Requires the clipboardWrite permission, or a user gesture:
    document.execCommand("copy");
}

var getting = chrome.storage.sync.get("shortened-url", function(result) {
    if (result["shortened-url"] !== undefined) {

        copyToClipboard(result["shortened-url"]);

        chrome.storage.sync.set({
            "shortened-url": undefined
        });
    }
});
