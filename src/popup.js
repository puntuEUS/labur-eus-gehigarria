function copyToClipboard(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
}


function handleDOMLoad() {
    chrome.runtime
        .sendMessage({
            from: 'popup',
            subject: 'getUrl',
        }, function(url) {
            console.log(url);
            const placeholder = document.querySelector('.js-url');
            placeholder.textContent = url;

            copyToClipboard(url);
        });
}

window.addEventListener('DOMContentLoaded', handleDOMLoad);
