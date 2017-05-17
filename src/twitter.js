var laburtu_button_html = '<span class="TweetBoxExtras-item"><div class="laburtu">' +
  '<button class="btn icon-btn js-tooltip laburtu-btn" type="button" data-delay="150" tabindex="0" data-original-title="Laburtu estekak">' +
    '<span class="laburtu-icon Icon Icon--laburtu"></span>' +
    '<span class="text laburtu-label u-hiddenVisually">Laburtu</span>' +
  '</button>' +
'</div>' +
'</span>';

if (document.getElementsByClassName("laburtu-btn").length === 0) {

    var tweet_boxes = document.getElementsByClassName("TweetBoxExtras tweet-box-extras");

    for (var i = 0; i < tweet_boxes.length; i++) {

        tweet_boxes[i].innerHTML = tweet_boxes[i].innerHTML + laburtu_button_html;

    }

    var buttons = document.getElementsByClassName("laburtu-btn");

    for (var i = 0; i < buttons.length; i++) {

        buttons[i].addEventListener("click", function(e) {

            var anchors = document.getElementById("tweet-box-global").getElementsByTagName("a");

            for (var j = 0; j < anchors.length; j++) {

                (function() {
                    var index = j;
                    var url = anchors[index].href;

                    chrome.runtime.sendMessage({
                        from: 'content',
                        subject: 'getUrl',
                        url: url
                    }, function(shortenedUrl) {
                        anchors[index].innerHTML = shortenedUrl;
                        anchors[index].href = shortenedUrl;
                        document.getElementById("tweet-box-global").focus();
                    });
                })();
            }
        });
    }
}
