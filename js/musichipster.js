var sp = getSpotifyApi(1);
var models = models = sp.require("sp://import/scripts/api/models");

window.onload = function() {
    var tabs = function() {
        var args = models.application.arguments;
        var current = $("#"+args[0]);
        var sections = $(".section");
        sections.hide();
        current.show();
    }

    models.application.observe(models.EVENT.ARGUMENTSCHANGED, tabs);

    $("#judgeMeButton").click(function() {
        var score = calculateScore();
        $("#score").html(score).show();
    });
}

var calculateScore = function() {
    // 1 point for each artist & album -- encourage variety, variety is good
    // 50 extra points for each hip artist -- encourage hip music, hip music is good
    // -100 points for each lame artist -- strongly discourage Bieber etc
    // -500 points if there's a top track by a lame artist

    var HIP = [
        "neutral milk hotel",
        "elliott smith",
        "pavement",
        "dinosaur jr.",
        "pixies",
        "talking heads",
        "death cab for cutie",
        "my bloody valentine"
    ];

    var UNHIP = [
        "justin bieber",
        "nickelback",
        "nicki minaj",
        "britney spears"
    ];

    var albums = models.library.albums;
    var artists = models.library.artists;
    var hip_points = 50 * (_.chain(artists)
                           .pluck("data")
                           .pluck("name")
                           .map(function(o) { return o.toLowerCase() })
                           .intersection(HIP).value().length);
    var unhip_points = -100 * (_.chain(artists)
                               .pluck("data")
                               .pluck("name")
                               .map(function(o) { return o.toLowerCase() })
                               .intersection(UNHIP).value().length);
    return albums.length + artists.length + hip_points + unhip_points;
}