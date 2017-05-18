var laburtu_button_html =   "<button class='btn-laburtu' aria-label='Laburtu txioko estekak' role='button' type='button' data-testid='Button'>" +
                                "<span class='laburtu-icon'></span>" +
                            "</button>";
console.log("kaixo");
document.addEventListener("DOMContentLoaded", function(event) {
    console.log("loaded");
    //var tweet_textarea = document.querySelector("[data-testid='tweet-textarea']");
    //console.log(tweet_textarea);
    var buttons = document.querySelectorAll("[data-testid='Button']");
    console.log(buttons[buttons.length - 1]);
    buttons[buttons.length - 1].insertAdjacentHTML("afterEnd", laburtu_button_html);
});
