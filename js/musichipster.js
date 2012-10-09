window.onload = function() {

    var tabs = function() {
        var args = models.application.arguments;
        var current = document.getElementById(args[0]);
        var sections = document.getElementsByClassName("section");
        for(i = 0; i < sections.length; i++) {
            sections[i].style.display = "none";
        }
        current.style.display = "block";
    }

    sp = getSpotifyApi(1);
    var models = sp.require("sp://import/scripts/api/models");
    models.application.observe(models.EVENT.ARGUMENTSCHANGED, tabs);
}