function saveOptions(e) {
    e.preventDefault();
    chrome.storage.sync.set({
        "api-key": document.querySelector("#api-key").value
    }, function() {

        chrome.runtime.sendMessage({
            from: "options",
            subject: "updateApiKey"
        });
    });
}

function restoreOptions() {

    chrome.storage.sync.get("api-key", function(result) {
        document.querySelector("#api-key").value = result['api-key'] || "";
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
