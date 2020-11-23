$(document).ready(function(){
    $(".flipper").click(function() {
    console.log("click");
    $(this).toggleClass("flip");
    });
});
