// Description:
// Returns a list of streamable MP3s.
//
// Dependencies:
// Requires SoundManager2, jQuery.
//
// Commands:
// soundcloud falloutboy

var ddg_spice_sound_cloud = function(api_result) {
    "use strict";

    // Display the plugin.
    Spice.render({
        data                     : api_result,
        header1                  : "Sound Cloud",
        source_url               : "https://soundcloud.com/search?q=",
        source_name              : "SoundCloud",
        template_normal          : "sound_cloud",
        carousel_css_id          : "google_plus",
        template_frame           : "carousel",
        force_big_header         : true,
        carousel_items           : api_result,
        carousel_template_detail: "sound_cloud_details",
        force_no_fold            : 1
    });

    var playSound = function(element) {
        $(".soundcloud-stream").each(function() {
            $(this).removeClass("playing");
            $(this).removeClass("paused");
        });
        soundManager.stopAll();
        var sound = soundManager.createSound({
            id       : $(element).attr("id"),
            url      : $(element).data("stream"),
            onfinish : function() {
                $(element).removeClass("playing");
            }
        });
        sound.play();
        $(element).addClass("playing");
    };

    var pauseSound = function(element) {
        var id= $(element).attr("id");
        soundManager.pause(id);
        $(element).removeClass("playing");
        $(element).addClass("paused");
    };

    var resumeSound = function(element) {
        var id = $(element).attr("id");
        soundManager.resume(id);
        $(element).removeClass("paused");
        $(element).addClass("playing");
    }

    $(".soundcloud-stream").click(function() {
        if(window.soundManager) {
            if($(this).hasClass("playing")) {
                pauseSound(this);
            } else if($(this).hasClass("paused")) {
                resumeSound(this);
            } else {
                playSound(this);
            }
        } else {
            // Load SoundManager2. This JS file handles our audio.
            window.SM2_DEFER = true;
            var that = this;
            $.getScript("/soundmanager2/script/soundmanager2-nodebug-jsmin.js", function() {
                soundSetup(that);
            });
        }
    });

    // Initialize SoundManager2.
    var soundSetup = function(element) {
        window.soundManager = new SoundManager();
        soundManager.url = "/soundmanager2/swf/";
        soundManager.flashVersion = 9;
        soundManager.useFlashBlock = false;
        soundManager.useHTML5Audio = false;
        soundManager.beginDelayedInit();
        soundManager.onready(function() {
            playSound(element);
        });
    };
};

Handlebars.registerHelper("chooseImage", function(artwork, avatar) {
    return artwork || avatar;
});