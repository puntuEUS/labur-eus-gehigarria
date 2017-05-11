function saveOptions(e) {
    e.preventDefault();
    browser.storage.local.set({
        "erabiltzaile-izena": document.querySelector("#erabiltzailea-izena").value
    });
}

function restoreOptions() {

    function setCurrentChoice(result) {
        document.querySelector("#erabiltzaile-izena").value = result.erabiltzaile_izena || "";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.local.get("erabiltzaile-izena");
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
