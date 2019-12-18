var mouseX;
var mouseY;
var dragging = false;
var dragOffsetX;
var dragOffsetY;
var feedback = false;

var Base64 = {
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }

        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = Base64._utf8_decode(output);
        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}

var ext = 1;

var sound = new Array(
    "sounds/contra_sound.wav",
    "sounds/fireball.wav",
    "sounds/quake.wav",
    "sounds/holy.wav",
    "sounds/ring.mp3",
    "sounds/woosh.mp3",
    "sounds/error.mp3",
    "sounds/error1.mp3",
    "sounds/error2.mp3",
    "sounds/pop.mp3",
    "sounds/ring2.mp3",
    "sounds/ting.mp3",
    "sounds/xylo.mp3",
    "sounds/dong.mp3");

var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
po.src = 'https://apis.google.com/js/plusone.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);

function loadSettings() {
    if(ext == 2) {
        safari.self.addEventListener("message", extensionResponse, false);
        safari.self.tab.dispatchMessage("getSettings");
    } else
        load();
}

function extensionResponse(callback) {
    //Settings fetched
    if(callback.name == "settings") {
        settings = callback.message;
        console.log(settings);
        load();
    }
}

function load() {
    defaults = 	[
        ["version", 0],
        ["jumpbuttons1", "off"],
        ["jumpbuttons2", "off"],
        ["autopreloading", "off"],
        ["autopreloading1", "off"],
        ["autoexpand1", "off"],
        ["autoexpand2", "off"],
        ["smartbarpos", 2],
        ["expandtype", 1],
        ["refreshinterval", 1],
        ["customrefresh", 10],
        ["expandw", 800],
        ["expandh", 9999],
        ["progress", "on"]
    ];

    for(i = 0; i < defaults.length; i++) {
        if(ext == 1) {
            if(!localStorage[defaults[i][0]])
                localStorage[defaults[i][0]] = defaults[i][1];
        } else {
            if(!settings[defaults[i][0]])
                safari.self.tab.dispatchMessage("setSetting", {'field' : defaults[i][0], 'value' : defaults[i][1] });
        }
    }

    $(".option").click(function() {
        var option = $(this).attr("id");
        if($(this).prop("checked")) {
            if(ext == 1)
                localStorage[option] = "on";
            else
                safari.self.tab.dispatchMessage("setSetting", {'field' : option, 'value' : "on" });
            var box = $(this).parent().parent();
            if(box.attr("id").match(/option/))
                box.attr("class", "active");
        } else {
            if(ext == 1)
                localStorage[option] = "off";
            else
                safari.self.tab.dispatchMessage("setSetting", {'field' : option, 'value' : "off" });
            if($(this).attr("class").match(/main/))
                $(this).parent().parent().attr("class", "inactive");
        }
    });

    $(".changeoption").change(function() {
        var option = $(this).attr("id");
        if(ext == 1)
            localStorage[option] = $(this).val();
        else
            safari.self.tab.dispatchMessage("setSetting", {'field' : option, 'value' : $(this).val() });
    });

    $(".textoption").keyup(function() {
        var option = $(this).attr("id");
        if(ext == 1)
            localStorage[option] = $(this).val();
        else
            safari.self.tab.dispatchMessage("setSetting", {'field' : option, 'value' : $(this).val() });
    });

    $(".radiooption").change(function() {
        var name = $(this).attr("name");
        var val = $(this).val();
        if(ext == 1)
            localStorage[name] = val;
        else
            safari.self.tab.dispatchMessage("setSetting", {'field' : name, 'value' : val });
    });

    //draggable feedback
    document.captureEvents(Event.MOUSEMOVE)
    document.onmousemove = getMouseXY;

    document.getElementById("dragArea").addEventListener("mousedown", function(e) {
        startDrag();
    }, false);

    document.addEventListener("mouseup", function(e) {
        stopDrag();
    }, false);

    //Settings string
    var settingsArray = [];
    if(ext == 1) {
        for(i in localStorage) {
            settingsArray.push(i + ":" + localStorage[i]);
            //set setting
            var item = $("#" + i);
            var klasse = item.attr("class");
            if(klasse && klasse.match(/^option/) && localStorage[i] != "off") //checkboxes
                item.attr("checked", "true");
            else if(klasse && klasse.match(/^radio/)) { //Radio buttons
                var name = item.attr("name");
                $('input:radio[name=' + name + ']:nth(' + localStorage[i] + ')').attr('checked',true);
            } else { //selections and inputs
                item.val(localStorage[i]);
                if(klasse && klasse.match(/main/))
                    item.parent().parent().attr("class", "inactive");
            }
        }
    } else {
        for(i in settings) {
            settingsArray.push(i + ":" + settings[i]);
            //set setting
            var item = $("#" + i);
            var klasse = item.attr("class");
            if(klasse && klasse.match(/^option/) && settings[i] != "off") //checkboxes
                item.attr("checked", "true");
            else if(klasse && klasse.match(/^radio/)) { //Radio buttons
                var name = item.attr("name");
                $('input:radio[name=' + name + ']:nth(' + settings[i] + ')').attr('checked',true);
            } else { //selections and inputs
                item.val(settings[i]);
                if(klasse && klasse.match(/main/))
                    item.parent().parent().attr("class", "inactive");
            }
        }
    }

    //loop through unset settings
    $(".option").each(function() {
        var option = $(this).attr("id");
        if(ext == 1) {
            if(!localStorage[option]) {
                localStorage[option] = "on";
                $(this).attr("checked", "true");
            }
        } else {
            if(!settings[option]) {
                safari.self.tab.dispatchMessage("setSetting", {'field' : option, 'value' : "on" });
                $(this).attr("checked", "true");
            }
        }
    });

    document.post = {
        settings : { value : Base64.encode(settingsArray.join("&")) },
        version  : { value : (ext == 1 ? localStorage['version'] : settings['version'] + " (Safari)") }
    };
}

function exports() {
    var settingsArray = [];
    if(ext == 1) {
        for(i in localStorage) {
            if(i != "hiddenThreads")
                settingsArray.push(i + ":" + localStorage[i]);
        }
    } else {
        for(i in settings) {
            if(i != "hiddenThreads")
                settingsArray.push(i + ":" + settings[i]);
        }
    }
    prompt("Save the following string to restore the current settings at any time", Base64.encode(settingsArray.join("&")));
}

function imports() {
    var string = Base64.decode(prompt("Insert settings string"));
    if(string) {
        var settingsArray = string.split("&");
        for(i = 0; i < settingsArray.length; i++) {
            var crntSetting = settingsArray[i].split(":");
            if(ext == 1)
                localStorage[crntSetting[0]] = crntSetting[1];
            else
                safari.self.tab.dispatchMessage("setSetting", {'field' : crntSetting[0], 'value' : crntSetting[1] });
        }
    }
    console.log(ext == 1 ? localStorage['version'] : settings['version']);
    window.location.reload();
}

function setSound(option, val) {
    //localStorage['option' + option] = val;
    var nsound = new Audio(sound[val]);
    nsound.play();
}

function positionReply(val) {
    //localStorage['option55'] = val;
}

function resize() {
    //Position donate
    var db = document.getElementById("donatebox");
    if(document.body.offsetWidth < 1200)
        db.style.left = "610px";
    else {
        db.style.left = "";
        db.style.right = "0px";
    }
}

function getMouseXY(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;

    if(dragging)
        dragAround();
}

function getPos(obj) {
    var curleft = 0;
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    return [curleft, curtop];
}

function dragAround() {
    var replybox = document.getElementById('quickrep');
    replybox.style.left = mouseX - dragOffsetX;
    replybox.style.top = mouseY - dragOffsetY;
}

function startDrag() {
    var replybox = document.getElementById('quickrep');
    var offset = getPos(replybox);
    dragOffsetX = mouseX - offset[0];
    dragOffsetY = mouseY - offset[1];
    dragging = true;
}

function stopDrag() {
    dragging = false;
}
function msg(id, obj) {
    var msg = document.getElementById("msg");

    switch(id) {
        case 1:
            msg.innerHTML = "Hover your mouse over images to preview the large version.";
            break;
        case 3:
            msg.innerHTML = "Stores the large version of an image in the preview image when it's loaded for easy saving.";
            break;
        case 4:
            msg.innerHTML = "Show preview of a quoted post above its reference when hovering your mouse over.";
            break;
        case 5:
            msg.innerHTML = "Shows the full postnumber on the /b/ board, instead of xxx as the last three numbers.";
            break;
        case 6:
            msg.innerHTML = "Automatically fetch new posts in a thread without refreshing the page.";
            break;
        case 7:
            msg.innerHTML = "Determines the number of seconds to wait before checking for new posts within a thread.";
            break;
        case 8:
            msg.innerHTML = "When the page is scrolled down to the bottom while the tab/window is active and one or more new posts appear, scroll the page along. This way you can lean back to read posts in a thread when it updates.";
            break;
        case 9:
            msg.innerHTML = "If both the auto-scroll feature and the quickreply box feature (see below) are enabled, scroll the quickreply box along with the page under the same conditions.";
            break;
        case 10:
            msg.innerHTML = "Add a button next to each thread on boards and optionally to the smart bar to open a quickreply/new thread box.";
            break;
        case 11:
            msg.innerHTML = "Enable the quickreply / new thread box on board pages.";
            break;
        case 12:
            msg.innerHTML = "Enable the quickreply box within threads.";
            break;
        case 13:
            msg.innerHTML = "Add a button next to each post to allow reporting a post more quickly.";
            break;
        case 14:
            msg.innerHTML = "Show an embedded Youtube video instead of a link when a Youtube link is posted";
            break;
        case 15:
            msg.innerHTML = "Make links clickable.";
            break;
        case 16:
            msg.innerHTML = "Change the filename of images to the name it was posted under, instead of the generated name by 4chan (works only WITHIN threads, not on board pages!)";
            break;
        case 17:
            msg.innerHTML = "Show a bar in the bottom of the page with useful functions";
            break;
        case 18:
            msg.innerHTML = "Remove the original replybox in the top of the page";
            break;
        case 19:
            msg.innerHTML = "Add the number of newly fetched posts within a thread to the title of the tab when you leave the tab, lose focus or when newly fetched posts aren't viewed yet";
            break;
        case 20:
            msg.innerHTML = "Always preload or expand all images in a thread and/or on boards. Note that this will cause explicit content to be downloaded, high bandwidth usage and possible speed loss";
            break;
        case 21:
            msg.innerHTML = "Preload the large version of all images within threads automatically";
            break;
        case 22:
            msg.innerHTML = "Preload the large version of all images on board pages automatically";
            break;
        case 23:
            msg.innerHTML = "Enlarge images to full scale, fit the screen or custom dimensions when clicking them, instead of opening them in a new tab. Functionality of opening images in a new tab can still be preserved by enabling 'Open images in a new tab on doubleclick'";
            break;
        case 24:
            msg.innerHTML = "Open images in a new tab by doubleclicking them";
            break;
        case 25:
            msg.innerHTML = "Determines the position of the smartbar";
            break;
        case 26:
            msg.innerHTML = "Add the current board to the smartbar within threads. Opens quicknavigation to every board when hoveling over";
            break;
        case 27:
            msg.innerHTML = "Add the current board to the smartbar on board pages. Opens quicknavigation to every board when hoveling over";
            break;
        case 28:
            msg.innerHTML = "Add a shortcut for quick reply to the smartbar within threads (protip: check 'Remove original replybox')";
            break;
        case 29:
            msg.innerHTML = "Add a shortcut for new threads to the smartbar on board pages (protip: check 'Remove original replybox')";
            break;
        case 30:
            msg.innerHTML = "Add quicklinks to jump to the top and bottom of the page to the smartbar within threads";
            break;
        case 31:
            msg.innerHTML = "Add quicklinks to jump to the top and bottom of the page to the smartbar on boards";
            break;
        case 32:
            msg.innerHTML = "Add a reply/sage counter to the smartbar within threads";
            break;
        case 33:
            msg.innerHTML = "Add the smartbar to threads";
            break;
        case 34:
            msg.innerHTML = "add the smartbar to board pages";
            break;
        case 35:
            msg.innerHTML = "Allows bookmarking of threads to get back to them whenever you like (currently works only when the smartbar is enabled)";
            break;
        case 36:
            msg.innerHTML = "Expand images to full scale";
            break;
        case 37:
            msg.innerHTML = "Expand images to fit within the screen";
            break;
        case 38:
            msg.innerHTML = "Expand images to fit within a custom defined space";
            break;
        case 39:
            msg.innerHTML = "Show an embedded Vocaroo voiceclip instead of a link when a Vocaroo link is posted";
            break;
        case 40:
            msg.innerHTML = "Expand all images on board pages automatically";
            break;
        case 41:
            msg.innerHTML = "Expand all images within threads automatically";
            break;
        case 42:
            msg.innerHTML = "Add a button to preload/expand all images to the smartbar within threads";
            break;
        case 43:
            msg.innerHTML = "Add a button to preload/expand all images to the smartbar on board pages";
            break;
        case 44:
            msg.innerHTML = "Makes links clickable and adds embeds when possible.";
            break;
        case 55:
            msg.innerHTML = "Lists all replies to a post underneath it.";
            break;
        case 56:
            msg.innerHTML = "Expand threads within boards.";
            break;
        case 58:
            msg.innerHTML = "Disable reply button after posting to prevent flood error";
            break;
        default:
            msg.innerHTML = "No description available yet";
            break;
    }

    msg.style.display = "block";
    msg.style.left = Math.min(Math.max(50, mouseX - msg.offsetWidth / 2), document.body.offsetWidth - 425);
    //msg.style.top = getPos(obj)[1] + 18;
    msg.style.top = obj.offset().top + 18;
}

function hideMsg() {
    document.getElementById("msg").style.display = "none";
}

function postFeedback() {
    if(!feedback) {
        feedback = true;
        document.getElementById("quickrep").style.display = "block";
    } else {
        feedback = false;
        document.getElementById("quickrep").style.display = "none";
        document.getElementById('postFrame').style.display = 'none';
    }
}

$(document).ready(function() {
    if (navigator.appVersion.indexOf("Mac") != -1)
        $("#safari").show();

    loadSettings();

    if(window.location.hash.match(/feedback/gi)) {
        setTimeout(function() {
            feedback = true;
            $("#quickrep").show();
        }, 1000);
    }

    //export
    $("#exports").click(function(e) {
        e.preventDefault();
        exports();
    });

    //import
    $("#imports").click(function(e) {
        e.preventDefault();
        imports();
    });

    //hoverables
    $(".msg").mouseover(function() {
        var msgid = parseFloat($(this).attr("id").substr(3));
        msg(msgid, $(this));
    }).mouseout(function() {
        hideMsg();
    });

    //feedback
    $("#feedback-btn").click(function(e) {
        e.preventDefault();
        postFeedback();
    });

    $("#send").click(function() {
        document.getElementById('postFrame').style.display = 'block';
        setTimeout(function() {
            post.com.value = '';
        }, 100);
    });

    $("#close-btn").click(function() {
        document.getElementById('quickrep').style.display = 'none';
        document.post.com.value = '';
        feedback = false;
        document.getElementById('postFrame').style.display = 'none';
    });
});

$(window).resize(function() {
    resize();
});
