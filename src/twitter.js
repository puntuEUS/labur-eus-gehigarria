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

            (function() {
                var index = i;
                var url = anchors[index].href;

                chrome.runtime.sendMessage({
                    from: 'content',
                    subject: 'getUrl',
                    url: url
                }, function(shortenedUrl) {
                    anchors[index].innerHTML = shortenedUrl;
                    anchors[index].href = shortenedUrl;
                    tweet_box_element.focus();
                });
            })();
        }
    }
}

document.addEventListener("click", function(e) {

    console.log(e.target);

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

            event.target.innerHTML = event.target.innerHTML + laburtu_button_html;

        }
	}
}

addEventListener("animationstart", insertListener, false); // standard + firefox
document.addEventListener("MSAnimationStart", insertListener, false); // IE
document.addEventListener("webkitAnimationStart", insertListener, false); // Chrome + Safari
