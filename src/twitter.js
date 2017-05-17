if ($(".laburtu-btn").length === 0) {

    $(".TweetBoxExtras.tweet-box-extras").append('<span class="TweetBoxExtras-item"><div class="laburtu">' +
      '<button class="btn icon-btn laburtu-btn js-tooltip" type="button" data-delay="150" tabindex="0" data-original-title="Laburtu estekak">' +
        '<span class="laburtu-icon Icon Icon--laburtu"></span>' +
        '<span class="text laburtu-label u-hiddenVisually">Laburtu</span>' +
      '</button>' +
    '</div>' +
    '</span>');
}

$(".laburtu-btn").click(function() {

    var anchors = document.getElementById("tweet-box-global").getElementsByTagName("a");

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
            });
        })();
    }
});
