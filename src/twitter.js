var laburtu_button_html = '<span class="TweetBoxExtras-item"><div class="laburtu">' +
  '<button class="btn icon-btn js-tooltip laburtu-btn" type="button" data-delay="150" tabindex="0" data-original-title="Laburtu estekak">' +
    '<span class="laburtu-icon Icon Icon--laburtu"></span>' +
    '<span class="text laburtu-label u-hiddenVisually">Laburtu</span>' +
  '</button>' +
'</div>' +
'</span>';

function rewriteTweetBoxContents(tweet_box_id) {
    var tweet_box = document.getElementById(tweet_box_id);

    if (tweet_box) {

        var anchors = tweet_box.getElementsByTagName("a");

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
                    document.getElementById(tweet_box_id).focus();
                });
            })();
        }
    }
}

if (document.getElementsByClassName("laburtu-btn").length === 0) {

    var tweet_boxes = document.getElementsByClassName("TweetBoxExtras tweet-box-extras");

    for (var i = 0; i < tweet_boxes.length; i++) {

        tweet_boxes[i].innerHTML = tweet_boxes[i].innerHTML + laburtu_button_html;

    }

    var buttons = document.getElementsByClassName("laburtu-btn");

    for (var i = 0; i < buttons.length; i++) {

        buttons[i].addEventListener("click", function(e) {

            rewriteTweetBoxContents("tweet-box-global");
            rewriteTweetBoxContents("tweet-box-home-timeline");

        });
    }
}
