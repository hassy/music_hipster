window.onload = function() {

    var tabs = function() {
        var args = models.application.arguments;
        var current = $("#"+args[0]);
        var sections = $(".section");
        sections.hide();
        current.show();
    }

    sp = getSpotifyApi(1);
    var models = sp.require("sp://import/scripts/api/models");
    models.application.observe(models.EVENT.ARGUMENTSCHANGED, tabs);
}

