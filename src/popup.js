function handleDOMLoad() {
    chrome.runtime
        .sendMessage({
            from: 'popup',
            subject: 'getUrl'
        }, function(url) {

            const placeholder = document.querySelector('.js-url');
            placeholder.textContent = url;
        });
}

window.addEventListener('DOMContentLoaded', handleDOMLoad);
