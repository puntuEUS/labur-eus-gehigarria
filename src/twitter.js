// Based on http://stackoverflow.com/a/8943487
function getArrayOfUrls(text) {
    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

    return text.match(urlRegex);
}

$(".TweetBoxExtras.tweet-box-extras").append('<span class="TweetBoxExtras-item"><div class="laburtu">' +
  '<button class="btn icon-btn laburtu-btn js-tooltip" type="button" data-delay="150" tabindex="0" data-original-title="Laburtu estekak">' +
    '<span class="laburtu-icon Icon Icon--laburtu"></span>' +
    '<span class="text laburtu-label u-hiddenVisually">Laburtu</span>' +
  '</button>' +
'</div>' +
'</span>');

$(".laburtu-btn").click(function() {
    var tweet = $("#tweet-box-global").text();

    var urls = getArrayOfUrls(tweet);

    urls.forEach(function(url) {

        chrome.runtime.sendMessage({
            from: 'content',
            subject: 'getUrl',
            url: url
        }, function(shortenedUrl) {
            console.log(shortenedUrl);
            tweet = tweet.replace(url, shortenedUrl);
            console.log(tweet);
            $("#tweet-box-global").text(tweet);
        });
    });

});
