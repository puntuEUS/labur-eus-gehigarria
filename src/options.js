function saveOptions(e) {
    e.preventDefault();
    
    chrome.storage.sync.set({
        "api-key": document.querySelector("#api-key").value
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

function restoreOptions() {

    chrome.storage.sync.get("api-key", function(result) {
        document.querySelector("#api-key").value = result['api-key'] || "";
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
