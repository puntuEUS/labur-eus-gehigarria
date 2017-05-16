function handleDOMLoad() {
    chrome.runtime
        .sendMessage({
            from: 'popup',
            subject: 'getUrl',
        }, function(url) {

            chrome.notifications.create({
                type: "basic",
                iconUrl: "icons/laburtu-96.png",
                title: "Laburtu.eus",
                message: `Helbidea arbelean kopiatu da: ${url}`
            });

            const placeholder = document.querySelector('.js-url');
            placeholder.textContent = url;
        });
}

window.addEventListener('DOMContentLoaded', handleDOMLoad);
