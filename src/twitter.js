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

var tweet_boxes = document.getElementsByClassName("TweetBoxExtras tweet-box-extras");

for (var i = 0; i < tweet_boxes.length; i++) {

    if (tweet_boxes[i].getElementsByClassName("laburtu-btn").length === 0) {

        tweet_boxes[i].innerHTML = tweet_boxes[i].innerHTML + laburtu_button_html;

    }
}

document.addEventListener("click", function(e) {

    if (e.target.classList.contains("laburtu-btn")) {

        var tweet_box_element = e.target.closest(".tweet-form").getElementsByClassName("tweet-box")[0];

        if (tweet_box_element) {
            shortenTweetBoxLinks(tweet_box_element);
        }
    }
});

// select the target node
var target = document.getElementById("permalink-overlay");
console.log(target);
// create an observer instance
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        console.log(mutation);

        for (var i = 0; i < mutation.addedNodes.length; i++){
            console.log(mutation.addedNodes[i]);
        }
        var tweet_boxes = target.getElementsByClassName("TweetBoxExtras tweet-box-extras");
        console.log(tweet_boxes);
        for (var i = 0; i < tweet_boxes.length; i++) {

            if (tweet_boxes[i].getElementsByClassName("laburtu-btn").length === 0) {

                tweet_boxes[i].innerHTML = tweet_boxes[i].innerHTML + laburtu_button_html;
                console.log(tweet_boxes[i]);

            }
        }
    });
});

// configuration of the observer:
var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subTree: true
};

// pass in the target node, as well as the observer options
observer.observe(target, config);

var insertListener = function(event){
	if (event.animationName == "nodeInserted") {
		// This is the debug for knowing our listener worked!
		// event.target is the new node!
		console.warn("Another node has been inserted! ", event, event.target);
        console.log(event.target);
        if (event.target.getElementsByClassName("laburtu-btn").length === 0) {

            event.target.innerHTML = event.target.innerHTML + laburtu_button_html;
            console.log(event.target);

        }
	}
}

addEventListener("animationstart", insertListener, false); // standard + firefox
document.addEventListener("MSAnimationStart", insertListener, false); // IE
document.addEventListener("webkitAnimationStart", insertListener, false); // Chrome + Safari
