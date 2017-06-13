var laburtu_button_html =   "<button class='laburtu-btn' aria-label='Laburtu txioko estekak' role='button' type='button' data-testid='Button'>" +
                                "<span class='laburtu-icon'>&nbsp;</span>" +
                            "</button>";

// Based on http://stackoverflow.com/a/8943487/2855012
function shortenTweetBoxLinks(text, callback) {
    var urlRegex =/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    var urls = text.match(urlRegex);

    // We need to detect URLs not starting with http, https, ftp.

    // Split the tweet with space.
    var parts = text.split(" ");

    parts.forEach(function (value, index, array) {

        // Check if it doesn't start with http://, https://, ftp://.
        if (!value.startsWith("http://") && !value.startsWith("https://") && !value.startsWith("ftp://")) {

            // We will accept only some TLDs: com, net, org, info, eus, es, fr, edu, cat, gal, biz, coop, eu
            var regexTLD = /(.+?)\.(com|net|org|info|eus|es|fr|edu|cat|gal|biz|coop|eu)(:|\?|\/|#|$)/ig;

            if (value.match(regexTLD)) {
                urls.push(value);
            }
        }

    });

    urls.forEach(function(value, index, array) {

        chrome.runtime.sendMessage({
            from: 'content',
            subject: 'getUrl',
            url: value
        }, function(shortenedUrl) {
            callback(value, shortenedUrl);
        });
    });
}

document.addEventListener("click", function(e) {

    // If the target of the click is our button or its inner span...
    if (e.target.classList.contains("laburtu-btn") || e.target.parentNode.classList.contains("laburtu-btn")) {

        var tweet_textarea = document.querySelector("[data-testid='tweet-textarea']");

        if (tweet_textarea) {

            shortenTweetBoxLinks(tweet_textarea.value, function(url, shortenedUrl) {
                tweet_textarea.value = tweet_textarea.value.replace(url, shortenedUrl);
                tweet_textarea.focus();
            });
        }
    }
});

// I couldn't detect node insertion the proper way (MutationObservers) so I used this hack.
// https://davidwalsh.name/detect-node-insertion
var insertListener = function(event){

	if (event.animationName == "nodeInserted" && document.getElementsByClassName("laburtu-btn").length === 0) {

        var buttons = document.getElementsByTagName("button");

        buttons[buttons.length - 1].insertAdjacentHTML("afterEnd", laburtu_button_html);
	}
}

addEventListener("animationstart", insertListener, false); // standard + firefox
document.addEventListener("MSAnimationStart", insertListener, false); // IE
document.addEventListener("webkitAnimationStart", insertListener, false); // Chrome + Safari
