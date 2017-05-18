var laburtu_button_html =   "<button class='laburtu-btn' aria-label='Laburtu txioko estekak' role='button' type='button' data-testid='Button'>" +
                                "<span class='laburtu-icon'>&nbsp;</span>" +
                            "</button>";

document.addEventListener("click", function(e) {

    // If the target of the click is our button or its inner span...
    if (e.target.classList.contains("laburtu-btn") || e.target.parentNode.classList.contains("laburtu-btn")) {

        var tweet_textarea = document.querySelector("[data-testid='tweet-textarea']");

        if (tweet_textarea) {
            alert(tweet_textarea.value);
        }
    }
});

// I couldn't detect node insertion the proper way (MutationObservers) so I used this hack.
// https://davidwalsh.name/detect-node-insertion
var insertListener = function(event){

	if (event.animationName == "nodeInserted" && document.getElementsByClassName("laburtu-btn").length === 0) {

        var buttons = document.querySelectorAll("[data-testid='Button']");

        buttons[buttons.length - 1].insertAdjacentHTML("afterEnd", laburtu_button_html);
	}
}

addEventListener("animationstart", insertListener, false); // standard + firefox
document.addEventListener("MSAnimationStart", insertListener, false); // IE
document.addEventListener("webkitAnimationStart", insertListener, false); // Chrome + Safari
