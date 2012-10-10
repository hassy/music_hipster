var sp = getSpotifyApi(1);
var models = models = sp.require("sp://import/scripts/api/models");

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
        $("#score").html(score).show().stealthIn();

        var top_tracks = models.library.starredPlaylist;
        var songs = _.reduce(_.range(top_tracks.data.length), function(acc, i) { 
                                                                    var track = top_tracks.data.getTrack(i);
                                                                    acc.push({"artist": track.artists[0].name, "track": track.name});
                                                                    return acc;
                                                                }, 
                                                                []);
        var url = "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=f1b9d7d9dce25181d0c843e69a2236dc&format=json";
        _.each(songs, function(s) {
            $.getJSON(url+"&artist="+encodeURIComponent(s.artist)+"&track="+encodeURIComponent(s.track), {}, function(json, status) {
                if(status == "success") {
                    if(!("error" in json)) {
                        var listener_count = Number(json.track.listeners);
                        var listener_score = "Terrible"; // by default
                        if(listener_count < 50000) {
                            listener_score = "<span style='color: #aaa;'>So so.</span>";
                        }
                        if(listener_count < 10000) {
                            listener_score = "Not bad, could do better.";
                        }
                        if(listener_count < 1000) {
                            listener_score = "<span style='color: green;'>Good job, very hip.</span>";
                        }
                        if(listener_count < 200) {
                            listener_score = "<span style='color: blue;'>Amazing, hopefully this band will never go mainstream.</span>";
                        }
                        $("#content").show();
                        $("#listeners>ul").append("<li>" + s.track + " has " + json.track.listeners + " listeners -- " + listener_score + "</li>");
                        $("#listeners").fadeIn(3000);
                        $(".hipsterImg").fadeIn(6000);
                    }
                }
            });
            // TODO: Check artist against the lists and dispense badges.
        });
    });
}

var calculateScore = function() {
    // 1 point for each artist & album -- encourage variety, variety is good
    // 50 extra points for each hip artist -- encourage hip music, hip music is good
    // -100 points for each lame artist -- strongly discourage Bieber etc

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

// http://peterbraden.co.uk/article/cod-text
$.fn.stealthIn = function(callback) {
    this.each(function(){
        
        var content = $(this).text();
        $(this).text("").css({
            'text-shadow' : '#000 0px 0px 5px',
            }).show();
        
        var i = 0;
        var j = 1;
        var x = $(this);
        var t = setInterval(function(){
            var cont = x.text();
            
            if (j==3){  
                x.text(cont.substr(0,i) + content[i]);
                i+=1;
                j=0;
            }else{
                x.text(cont.substr(0,i) + String.fromCharCode(
                    1072 + parseInt(Math.random()*20)));    
                j+=1;
            }
                    
            if (i == content.length){
                clearInterval(t);
                if (callback){
                    callback();
                }
            }   
        }, 20);
    });
}