function saveOptions(e) {
    e.preventDefault();

    var api_key = document.querySelector("#api-key").value;

    // Don't save the API key if it's empty.
    if (api_key !== "") {

        chrome.storage.sync.set({
            "api-key": api_key
        }, function() {

            chrome.runtime.sendMessage({
                from: "options",
                subject: "updateApiKey"
            }, function(message) {

                if (message) {
                    document.getElementById("message").style.display = "inline-block";

                    setTimeout(function() {
                        document.getElementById("message").style.display = "none";
                    }, 2500);
                }
            });
        });
    }
}

function restoreOptions() {

    chrome.storage.sync.get("api-key", function(result) {
        document.querySelector("#api-key").value = result['api-key'] || "";
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
