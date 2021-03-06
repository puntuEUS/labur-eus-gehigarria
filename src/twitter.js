var laburtu_button_html = '<span class="TweetBoxExtras-item"><div class="laburtu">' +
  '<button class="btn icon-btn js-tooltip laburtu-btn" type="button" data-delay="150" tabindex="0" data-original-title="Laburtu estekak">' +
    '<span class="laburtu-icon Icon Icon--laburtu"></span>' +
    '<span class="text laburtu-label u-hiddenVisually">Laburtu</span>' +
  '</button>' +
'</div>' +
'</span>';

function shortenTweetBoxLinks(tweet_box_element) {

    if (tweet_box_element) {

        var anchors = tweet_box_element.getElementsByTagName("a");

        for (var i = 0; i < anchors.length; i++) {

            // Don't shorten the hashtags and user mentions.
            if (["#", "@"].indexOf(anchors[i].text[0]) === -1) {

                (function() {
                    var index = i;
                    var url = anchors[index].href;

                    chrome.runtime.sendMessage({
                        from: 'content',
                        subject: 'getUrl',
                        url: url
                    }, function(shortenedUrl) {
                        anchors[index].text = shortenedUrl;
                        tweet_box_element.focus();
                    });
                })();
            }
        }

        // twitter.com doesn't detect some URLs, e.g. URLs with two letter long top level domains eu, es, fr.
        // Split the tweet with whitespace.
        var parts = tweet_box_element.textContent.split(/\s/);
        
        parts.forEach(function (value, index, array) {

            // We will accept only some TLDs: es, fr, eu
            var regexTLD = /(.+?)\.(es|fr|eu)(:|\?|\/|#|$)/ig;

            if (value.match(regexTLD)) {
                chrome.runtime.sendMessage({
                    from: 'content',
                    subject: 'getUrl',
                    url: value
                }, function(shortenedUrl) {
                    tweet_box_element.textContent = tweet_box_element.textContent.replace(value, shortenedUrl);
                    tweet_box_element.focus();
                });
            }
        });
    }
}

document.addEventListener("click", function(e) {

    // If the target of the click is our button or its inner span...
    if (e.target.classList.contains("laburtu-btn") || e.target.parentNode.classList.contains("laburtu-btn")) {

        var tweet_box_element = e.target.closest(".tweet-form").getElementsByClassName("tweet-box")[0];

        if (tweet_box_element) {
            shortenTweetBoxLinks(tweet_box_element);
        }
    }
});

// I couldn't detect node insertion the proper way (MutationObservers) so I used this hack.
// https://davidwalsh.name/detect-node-insertion
var insertListener = function(event){

	if (event.animationName == "nodeInserted") {

        if (event.target.getElementsByClassName("laburtu-btn").length === 0) {

            event.target.insertAdjacentHTML("afterbegin", laburtu_button_html);

        }
	}
}

addEventListener("animationstart", insertListener, false); // standard + firefox
document.addEventListener("MSAnimationStart", insertListener, false); // IE
document.addEventListener("webkitAnimationStart", insertListener, false); // Chrome + Safari
