var settings;
var board = false;
var inThread = false;
var protocol = document.location.protocol;

if(window.location.href.match(/boards\.4chan\.org/))
chrome.runtime.sendMessage({'getOptions' : true }, settingsLoaded);

function settingsLoaded(settingsCallback) {
settings = settingsCallback.message;
//Determine board
var matches = window.location.href.match(/4chan\.org\/(\w+)\/?/);
if(matches)
    board = matches[1];

//Board detected?
if(board)
    inThread = window.location.href.match(/\/res\/([0-9]+)/); //Thread or board?

//f fix
if(board == "f")
    return false;

var css = "";

if(settings["hiderep"] == "on")
    css += "#postForm { display: none; }";

//Inject stylesheet
if(css.length > 0) {
    var style = document.createElement('style');
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.documentElement.appendChild(style);
}
}

/*if(document.readyState == "interactive" || document.readyState == "complete"){
initApp();
}*/
document.addEventListener('DOMContentLoaded', function() {
setTimeout(function() {
    initApp();
}, 1)

});


function initApp(){
var ext = 1;//Chrome: 1, Safari: 2
var img;
if(ext == 1) {
    img = {	load: chrome.extension.getURL("img/loader.gif"),
        fof: chrome.extension.getURL("img/404.png"),
        rprt: chrome.extension.getURL("img/report.png"),
        close: chrome.extension.getURL("img/x.png"),
        replyicon: chrome.extension.getURL("img/quickrep.png"),
   //     logo: chrome.extension.getURL("icon48.png"),
        min: chrome.extension.getURL("img/min.png"),
        exp: chrome.extension.getURL("img/expand.png"),
        refreshBtn: chrome.extension.getURL("img/refresh.png"),
        favs: chrome.extension.getURL("img/bookmarks.png"),
        star: chrome.extension.getURL("img/star.png"),
        playbut: chrome.extension.getURL("img/play.png"),
        awwyeah: chrome.extension.getURL("img/awwyeah.png"),
        x: chrome.extension.getURL("img/close.png")};
} else if(ext == 2) {
    img = {	load: safari.extension.baseURI + "img/loader.gif",
        fof: safari.extension.baseURI + "img/404.png",
        rprt: safari.extension.baseURI + "img/report.png",
        close: safari.extension.baseURI + "img/x.png",
        replyicon: safari.extension.baseURI + "img/quickrep.png",
        logo: safari.extension.baseURI + "icon48.png",
        min: safari.extension.baseURI + "img/min.png",
        exp: safari.extension.baseURI + "img/expand.png",
        refreshBtn: safari.extension.baseURI + "img/refresh.png",
        favs: safari.extension.baseURI + "img/bookmarks.png",
        star: safari.extension.baseURI + "img/star.png",
        playbut: safari.extension.baseURI + "img/play.png",
        x: safari.extension.baseURI + "img/close.png"};
} //Images
var links = /(?:https?|ftp):\/\/[^\s'"'<>()]+|www\.[^\s'"'<>()]+|[\-\w.+]+@(?:[\-\w]+\.)+[\w]{2,6}/gi;
var title;
var showpopup;
var showquickreply;
var hiddenThreads;
var dblclick;
var files = {};
var backlinks = {};
var recapreload;
var reloadcheck;
var resetMessage;
var totalImg = 15;
var resto;
var dragging;
var curquote;
var autodown;
var autoexpand;
var threadposts;
var images = [0,0];
var refresher;
var refreshrate;
var speedyrefresh;
var windowfocus = true;
var unread = 0;
var curextquote;
var frames;
var cooldowncount;
var cooldown;
var iframes = [];
var recaprefresh;
var lastFind;

//Comments with a (!) need a check up!

//menu with board links (!)
var boardMenu = '<div class="column">' +
    '<h3>Japanese Culture</h3>' +
    '<ul>' +
    '<li><a href="/a/" class="boardlink" title="Anime &amp; Manga">Anime &amp; Manga</a></li>' +
    '<li><a href="/c/" class="boardlink" title="Anime/Cute">Anime/Cute</a></li>' +
    '<li><a href="/w/" class="boardlink" title="Anime/Wallpapers">Anime/Wallpapers</a></li>' +
    '<li><a href="/m/" class="boardlink" title="Mecha">Mecha</a></li>' +
    '<li><a href="/cgl/" class="boardlink" title="Cosplay &amp; EGL">Cosplay &amp; EGL</a></li>' +
    '<li><a href="/cm/" class="boardlink" title="Cute/Male">Cute/Male</a></li>' +
    '<li><a href="/f/" class="boardlink" title="Flash">Flash</a></li>' +
    '<li><a href="/n/" class="boardlink" title="Transportation">Transportation</a></li>' +
    '<li><a href="/jp/" class="boardlink" title="Otaku Culture">Otaku Culture</a></li>' +
    '<li><a href="/vp/" class="boardlink" title="Pokémon">Pokémon</a></li>' +
    '</ul>' +
    '</div>' +
    '<div class="column">' +
    '<h3>Interests</h3>' +
    '<ul>' +
    '<li><a href="/v/" class="boardlink" title="Video Games">Video Games</a></li>' +
    '<li><a href="/vg/" class="boardlink" title="Video Games Generals">Video Game Generals</a></li>' +
    '<li><a href="/vr/" class="boardlink" title="Retro Games">Retro Games</a></li>' +
    '<li><a href="/co/" class="boardlink" title="Comics &amp; Cartoons">Comics &amp; Cartoons</a></li>' +
    '<li><a href="/g/" class="boardlink" title="Technology">Technology</a></li>' +
    '<li><a href="/tv/" class="boardlink" title="Television &amp; Film">Television &amp; Film</a></li>' +
    '<li><a href="/k/" class="boardlink" title="Weapons">Weapons</a></li>' +
    '<li><a href="/o/" class="boardlink" title="Auto">Auto</a></li>' +
    '<li><a href="/an/" class="boardlink" title="Animals &amp; Nature">Animals &amp; Nature</a></li>' +
    '<li><a href="/tg/" class="boardlink" title="Traditional Games">Traditional Games</a></li>' +
    '<li><a href="/sp/" class="boardlink" title="Sports">Sports</a></li>' +
    '<li><a href="/asp/" class="boardlink" title="Alternative Sports">Alternative Sports</a></li>' +
    '<li><a href="/sci/" class="boardlink" title="Science &amp; Math">Science &amp; Math</a></li>' +
    '<li><a href="/int/" class="boardlink" title="International">International</a></li>' +
    '<li><a href="/out/" class="boardlink" title="Outdoors">Outdoors</a></li>' +
    '</ul>' +
    '</div>' +
    '<div class="column">' +
    '<h3>Creative</h3>' +
    '<ul>' +
    '<li><a href="/i/" class="boardlink" title="Oekaki">Oekaki</a></li>' +
    '<li><a href="/po/" class="boardlink" title="Papercraft &amp; Origami">Papercraft &amp; Origami</a></li>' +
    '<li><a href="/p/" class="boardlink" title="Photography">Photography</a></li>' +
    '<li><a href="/ck/" class="boardlink" title="Food &amp; Cooking">Food &amp; Cooking</a></li>' +
    '<li><a href="/ic/" class="boardlink" title="Artwork/Critique">Artwork/Critique</a></li>' +
    '<li><a href="/wg/" class="boardlink" title="Wallpapers/General">Wallpapers/General</a></li>' +
    '<li><a href="/mu/" class="boardlink" title="Music">Music</a></li>' +
    '<li><a href="/fa/" class="boardlink" title="Fashion">Fashion</a></li>' +
    '<li><a href="/toy/" class="boardlink" title="Toys">Toys</a></li>' +
    '<li><a href="/3/" class="boardlink" title="3DCG">3DCG</a></li>' +
    '<li><a href="/gd/" class="boardlink" title="Graphic Design">Graphic Design</a></li>' +
    '<li><a href="/diy/" class="boardlink" title="Do-It-Yourself">Do-It-Yourself</a></li>' +
    '<li><a href="/wsg/" class="boardlink" title="Worksafe GIF">Worksafe GIF</a></li>' +
    '</ul>' +
    '</div>' +
    '<div class="column">' +
    '<h3>Adult <span class="warning"></span></h3>' +
    '<ul>' +
    '<li><a href="/s/" class="boardlink" title="Sexy Beautiful Women">Sexy Beautiful Women</a></li>' +
    '<li><a href="/hc/" class="boardlink" title="Hardcore">Hardcore</a></li>' +
    '<li><a href="/hm/" class="boardlink" title="Handsome Men">Handsome Men</a></li>' +
    '<li><a href="/h/" class="boardlink" title="Hentai">Hentai</a></li>' +
    '<li><a href="/e/" class="boardlink" title="Ecchi">Ecchi</a></li>' +
    '<li><a href="/u/" class="boardlink" title="Yuri">Yuri</a></li>' +
    '<li><a href="/d/" class="boardlink" title="Hentai/Alternative">Hentai/Alternative</a></li>' +
    '<li><a href="/y/" class="boardlink" title="Yaoi">Yaoi</a></li>' +
    '<li><a href="/t/" class="boardlink" title="Torrents">Torrents</a></li>' +
    '<li><a href="http://rs.4chan.org/" class="boardlink" title="Rapidshares">Rapidshares</a></li>' +
    '<li><a href="/hr/" class="boardlink" title="High Resolution">High Resolution</a></li>' +
    '<li><a href="/gif/" class="boardlink" title="Adult GIF">Adult GIF</a></li>' +
    '</ul>' +
    '</div>' +
    '<div class="column">' +
    '<h3>Other</h3>' +
    '<ul>' +
    '<li><a href="/q/" class="boardlink" title="4chan Discussion">4chan Discussion</a></li>' +
    '<li><a href="/trv/" class="boardlink" title="Travel">Travel</a></li>' +
    '<li><a href="/fit/" class="boardlink" title="Health &amp; Fitness">Health &amp; Fitness</a></li>' +
    '<li><a href="/x/" class="boardlink" title="Paranormal">Paranormal</a></li>' +
    '<li><a href="/lit/" class="boardlink" title="Literature">Literature</a></li>' +
    '<li><a href="/adv/" class="boardlink" title="Advice">Advice</a></li>' +
    '<li><a href="/lgbt/" class="boardlink" title="LGBT">LGBT</a></li>' +
    '<li><a href="/mlp/" class="boardlink" title="Pony">Pony</a></li>' +
    '</ul>' +
    '<h3>Misc. <span class="warning"></span></h3>' +
    '<ul>' +
    '<li><a href="/b/" class="boardlink" title="Random">Random</a></li>' +
    '<li><a href="/r/" class="boardlink" title="Request">Request</a></li>' +
    '<li><a href="/r9k/" class="boardlink" title="Social">ROBOT9001</a></li>' +
    '<li><a href="/pol/" class="boardlink" title="Social">Politically incorrect</a></li>' +
    '<li><a href="/soc/" class="boardlink" title="Social">Social</a></li>' +
    '</ul>' +
    '</div>' +
    '<br class="clear-bug">';

//check if page is a foreground window (!)
if(window.top === window || ext == 1) {
    if(ext == 1) {
        chrome.runtime.onMessage.addListener(
            function(request, sender) {
                extensionResponses(request.response);
            });
    } else if(ext == 2)
        safari.self.addEventListener("message", extensionResponses, false);

    /*if(board) {
     for(var i = 0; i < 3; i++) {
     hrs[i].style.display = "none";
     }
     }*/

    //get or check for settings
    if(ext == 1) {
        if(settings)
            applyFeatures();
        else {
            window.settings;
            window.board = false;
            window.inThread = false;
            window.protocol = document.location.protocol;

            chrome.runtime.sendMessage({'getOptions' : true }, extensionResponses);
        }
    } else if(ext == 2)
        safari.self.tab.dispatchMessage("getSettings");
} else {
    //Dispatch message from iframe (safari)
    if(window.location.href.match(/(sys.4chan.org\/\w+\/post|banned)/) && ext == 2) {
        safari.self.tab.dispatchMessage("posted", { 'response' : document.body.innerHTML });
    }
}

//responses from fetched pages
function extensionResponses(callback) {
    if(window.top == window || ext == 1) {
        if(callback.name == "pageModified") {
            if(callback.message.status == 404) {
                $(".board").append("<b>Thread 404'd after this.</b><hr />");
                document.title = "(404) " + title;

                speedyrefresh = false;
                clearTimeout(refresher);
                return;
            }

            var curtime = new Date().getTime();
            if(!callback.message.updated) {
                //juh
                var tempRefreshRate = refreshrate;

                if(!lastFind)
                    lastFind = callback.message.lastModified;

                var dif = Math.round((curtime - lastFind) / 1000);

                if(dif > 90)
                    tempRefreshRate = 90000;
                else if(dif > 60)
                    tempRefreshRate = 60000;
                else if(dif > 30)
                    tempRefreshRate = 30000;
                else if(dif > 20)
                    tempRefreshRate = 20000;
                else if(dif > 15)
                    tempRefreshRate = 15000;
                else if(dif > 10)
                    tempRefreshRate = 10000;

                //Reset thread updater
                clearTimeout(refresher);
                refresher = setTimeout(function() {
                    refreshThread();
                }, tempRefreshRate);
            } else {
                lastFind = curtime;
                chrome.runtime.sendMessage({'link': window.location.href, 'returnmsg': "newposts" }, extensionResponses);
            }
        }

        //Page fetched for new post check
        if(callback.name == "newposts") {
            findNewPosts(callback.message.message);
            console.log("Refreshing thread...");
        }

        //Page fetched for thread expansion
        if(callback.name == "expansion") {
            expandThread(callback.message.action, callback.message.message);
        }

        //Page fetched for external quote
        if(callback.name == "extquote")
            externalQuote(callback.message.action, callback.message.message);

        //Settings fetched
        if(callback.name == "settings") {
            settings = callback.message;

            //Determine board
            var matches = window.location.href.match(/4chan\.org\/(\w+)\/?/);
            if(matches)
                board = matches[1];

            //Thread or board?
            if(board)
                inThread = window.location.href.match(/res\/([0-9]+)/);

            //http / https
            window.protocol = document.location.protocol;

            //apply features!
            applyFeatures();
        }

        //Post result
        if(callback.name === "postResult")
            processPostResponse(callback.message);
    }
}

//post submitted
function processPostResponse(response) {
    $("#message").hide();
    $("#progress").hide().removeAttr("value");
    $("#fileupload").show();

    //Find response message
    var errorcheck = response.match(/(Error: [^<]+)/gi);
    var bancheck = response.match(/You are banned/gi);
    var closedcheck = response.match(/can.t reply/gi);

    if(errorcheck) { //found error
        $("#response").html(errorcheck[1]).show();
        //if(response.match(/(mistyped|verification)/gi)) { //mistyped captcha
        $("#clone_recaptcha_response_field").val("").focus();
        //}
    } else if(bancheck)
        $("#response").html("You are banned!").show();
    else if(closedcheck)
        $("#response").html("You can't reply to this thread anymore.").show();
    else if(response.match(/successful/gi)) {
        //cooldown
        $("#submitbutton").attr("disabled", true).val("Cooldown: 30");
        cooldown = 29;
        cooldowncount = setInterval(function() {
            cooldown--;
            if(cooldown == 0) {
                $("#submitbutton").removeAttr("disabled").val("Submit");
                clearInterval(cooldowncount);
            } else
                $("#submitbutton").val("Cooldown: " + cooldown);
        }, 1000);

        //reset form
        $("#clone_postFile").replaceWith("<input id='clone_postFile' name='upfile' type='file' />");
        document.getElementById("postform").com.value = "";
        document.forms['post'].elements['com'].value = "";
        $("#clone_recaptcha_response_field").val("");

        if(inThread) {
            hideQuickreply();
            speedyrefresh = true;
            setTimeout(function() {
                speedyrefresh = false;
            }, 50000);
            refreshThread();
        } else {
            hideQuickreply();
            var posturl;
            threadno = response.match(/thread:[0-9]+,no:([0-9]+)/);
            if(resto) {
                posturl = "res/" + resto + "#p" + threadno[1];
                resto = false;
            } else
                posturl = "res/" + threadno[1];

            window.location = protocol + "//boards.4chan.org/" + board + "/" + posturl;
        }
    } else {
        $("#response").html("Error: Something went wrong").show();
        console.log("response" + response);
    }

    //Clear error message after 5 sec
    clearInterval(resetMessage);
    resetMessage = setTimeout(function() {
        $("#response").hide();
    }, 5000);
}

//run js on page
function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.documentElement.appendChild(script); // run the script
    document.documentElement.removeChild(script); // clean up
}

//Non-dynamic 4chan Plus features
function applyFeatures() {
    //apply below only on boards and threads
    if(!window.location.href.match(/boards\./) || board == "f")
        return false;

    //Music detection
    var ifs = document.getElementsByTagName("iframe");
    var embs = document.getElementsByTagName("embed");

    if(ifs.length > 0) {
        for(i = 0; i < ifs.length; i++) {
            if(ifs[i].src != "about:blank") {
                iframes.push([ifs[i], ifs[i].src]);
                if(settings["autoblock"] != "off") {
                    ifs[i].src = "";
                    ifs[i].style.display = "none";
                }
            }
        }

        for(i = 0; i < embs.length; i++) {
            iframes.push([embs[i], embs[i].src]);
            if(settings["autoblock"] != "off") {
                embs[i].src = "";
                embs[i].style.display = "none";
            }
        }

        if(iframes.length > 0) {
            var musicdetection = document.createElement("div");
            musicdetection.setAttribute("class", "musicDetection reply");
            musicdetection.innerHTML = "<h3>Media detected!</h3><input type='checkbox' id='mediatoggle' " + (settings["autoblock"] != "off" ? "checked='true' " : "") + "/><label for='mediatoggle'>Disable media</label>";
            document.body.appendChild(musicdetection);

            $("#mediatoggle").click(function() {
                if($(this).is(":checked")) {
                    for(i = 0; i < iframes.length; i++) {
                        iframes[i][0].src = "";
                        iframes[i][0].style.display = "none";
                    }
                    chrome.runtime.sendMessage({'field' : 'autoblock', 'setValue' : 'on' });
                } else {
                    for(i = 0; i < iframes.length; i++) {
                        iframes[i][0].src = iframes[i][1];
                        iframes[i][0].style.display = "block";
                    }
                    chrome.runtime.sendMessage({'field' : 'autoblock', 'setValue' : 'off' });
                }
            });
        }
    }

    //set refresh interval
    var ref = settings['refreshinterval'];
    if(ref == 0)
        refreshrate = 1000;
    else if(ref == 2)
        refreshrate = Math.max(settings['customrefresh'] * 1000, 3000);
    else
        refreshrate = 3000;

    //Set title in threads (!)
    if(inThread && board) {
        title = "/" + board + "/ - " + document.getElementsByTagName("blockquote")[0].innerHTML.replace(/\<.*?\>/g, "");
        document.title = title;
    }

    //Popup window
    $("<div />").attr("id", "popup").appendTo('body');

    //close original replybox
    if(inThread)
        $(".navLinks.desktop:first").append('<img id="orix" class="extButton inthread" alt="Toggle" title="Toggle replybox" src="//static.4chan.org/image/buttons/futaba/post_expand_minus.png" />');
    else
        $(".abovePostForm").append('<img id="orix" class="extButton board" alt="Toggle" title="Toggle replybox" src="//static.4chan.org/image/buttons/futaba/post_expand_minus.png" />');

    $("#orix").click(function() {
        if($(this).hasClass("min-rep")) {
            $(this).attr('src', '//static.4chan.org/image/buttons/futaba/post_expand_minus.png');
            $("#postForm").show();
            $(this).removeClass("min-rep");
            if(ext == 1)
                chrome.runtime.sendMessage({'field' : 'hiderep', 'setValue' : "off" });
            else
                safari.self.tab.dispatchMessage("setSetting", { 'field' : 'hiderep', 'value' : "off" });
        } else {
            $(this).attr('src', '//static.4chan.org/image/buttons/futaba/post_expand_plus.png');
            $("#postForm").hide();
            $(this).addClass("min-rep");
            if(ext == 1)
                chrome.runtime.sendMessage({'field' : 'hiderep', 'setValue' : "on" });
            else
                safari.self.tab.dispatchMessage("setSetting", { 'field' : 'hiderep', 'value' : "on" });
        }
    });

    if(settings['hiderep'] == "on")
        $("#orix").click();

    //Smartbar
    if(settings['smartbar'] != "off" && ((settings['smartbar1'] != "off" && !inThread) || (settings['smartbar2'] != "off" && inThread))) {
        //Preload/expand buttons
        var imageDownload = "<div style='margin-bottom: -4px'>" +
            "<input type='checkbox' id='autodown' /> <label style='cursor: pointer' for='autodown'>Preload images <span id='counter'>(" + totalImg + ")</span></label>" +
            "</div><div style='margin-bottom: -10px'>" +
            "<input type='checkbox' id='autoexpand' class='checkoff' /> <label style='cursor: pointer' for='autoexpand'>Expand images</label>" +
            "</div>";

        //Empty smartbar
        var navbar = document.createElement("div");
        navbar.id = "navbar";
        navbar.setAttribute("class", "reply navbar" + settings['smartbarpos']);
        navbar.setAttribute("style", "border-top-width: 1px !important;");

        var insertion = "";
        //Board indicator (!)
        insertion += "<li id='crntBoard'><a href='/" + board + "' style='text-decoration: none;'>/" + board + "/</a></li>";

        //Preload/expand buttons
        if(((settings['preloading1'] != "off" && !inThread) || (settings['preloading2'] != "off" && inThread))) {
            insertion += "<li id='loadImages'>" + imageDownload + "</li>";
        }

        //add quick reply / new thread buttons
        if(settings['quickreply'] != "off") {
            if(settings['quickbutton2'] != "off" && settings['quickreply2'] != "off" && inThread)
                insertion += "<li class='quickreplybar'><span style='font-size: 15px'>&#8627;</span> <a id='navquickbutton' style='cursor: pointer'>Reply</a></li>";
            else if(settings['quickbutton1'] != "off" && settings['quickreply1'] != "off" && !inThread)
                insertion += "<li class='quickreplybar'><span style='font-size: 15px'>&#8627;</span> <a id='navquickbutton' style='cursor: pointer'>New thread</a></li>";
        }


        //Add jump buttons
        if((settings['jumpbuttons1'] != "off" && !inThread) || (settings['jumpbuttons2'] != "off" && inThread))
            insertion += "<li class='jump'><a href='javascript:window.scrollTo(0, 0);'>Top</a> &uarr; <a href='javascript:window.scrollTo(0, document.body.scrollHeight);'>Bottom</a> &darr;</li>";

        //Add smartbar to page
        navbar.innerHTML = "<div id='baritems'>" + insertion + "</div>";
        document.body.appendChild(navbar);

        //Debug for right aligned smartbar
        if(settings['smartbarpos'] == 2) {
            navbar.style.marginLeft = (navbar.offsetWidth / 2 * -1) + "px";
        }

        var boardsMenu = document.createElement("div");
        boardsMenu.id = "boardsMenu";
        boardsMenu.setAttribute("class", "reply");

        boardsMenu.innerHTML = boardMenu;
        if(settings['smartbarpos'] == 1)
            boardsMenu.style.left = "0px";
        if(settings['smartbarpos'] == 2) {
            boardsMenu.style.left = "50%";
            boardsMenu.style.marginLeft = "-325px";
            navbar.style.marginLeft = (navbar.offsetWidth / 2 * -1) + "px";
        }
        if(settings['smartbarpos'] == 3)
            boardsMenu.style.right = "0px";
        navbar.firstChild.firstChild.appendChild(boardsMenu);


        if((settings['preloading1'] != "off" && !inThread) || (settings['preloading2'] != "off" && inThread)) {
            $("#autodown").change(function() {
                if($(this).attr("checked")) {
                    autodown = true;
                    preloadImages();
                } else {
                    autodown = false;
                }
            });

            //expand all images
            $("#autoexpand").change(function() {
                if($(this).attr("checked")) {
                    autoexpand = true;
                    expandAll();
                } else {
                    autoexpand = false;
                    $(".fileThumb").each(function() {
                        var fileID = $(this).parent().attr("id");
                        $(this).html("<img src='" + files[fileID][0] + "' />").find("img")
                            .css({
                                width: files[fileID][4][0],
                                height: files[fileID][4][1]
                            });
                        files[fileID][2] = false;
                    });
                }
            });
        }


        //Quickreplybutton clickable
        if(settings['quickreply'] != "off" && ((settings['quickbutton1'] != "off" && !inThread) || (settings['quickbutton2'] != "off" && inThread))) {
            //Smartbar reply/new thread
            $("#navquickbutton").click(function(e) {
                document.querySelectorAll('#togglePostFormLink a')[0].click();
                var replybox = $("#quickrep");
                if(!replybox.length){
                    window.scrollTo(0,0)
                }
                if(!showquickreply || resto || (replybox.offset().top + replybox.height() < document.body.scrollTop || replybox.offset().top > document.body.scrollTop + window.innerHeight)) {
                    e.stopPropagation();
                    replybox.show();
                    showquickreply = true;
                    positionReplybox(400, 0, true);

                    if(replybox.length && !replybox[0].querySelector('#quickreplydragform form')){
                        replybox[0].querySelector('#quickreplydragform').appendChild( document.querySelectorAll('form')[0] );
                    }

                    if(resto) {
                        //document.getElementById("postform").com.value = "";
                        document.forms['post'].elements['com'].value = "";
                        $("#restofield").val("");
                        $("#quicktitle").html("New thread");
                        resto = false;
                    }
                } else {
                    e.stopPropagation();
                    hideQuickreply();
                }
            });
        }
    }

    //determine title
    if(!title)
        title = document.title;

    //quickreply
    setTimeout(buildReplyBox, 150);

    //Check window focus
    $(window).focus(function() {
        windowfocus = true;
    }).blur(function() {
        windowfocus = false;
    });

    //Thread updating
    if(settings['threadupdating'] != "off" && inThread) {
        refresher = setTimeout(function() {
            refreshThread();
        }, refreshrate);
    }

    //Thread expansion
    if(settings['expansion'] != "off" && !inThread) {
        $(".summary").each(function() {
            var val = $(this).html().match(/([^.]+\.)/);
            var expand = $("<img />").attr({
                "src": img.exp,
                "class": "expand"
            });
            $(this).html(val[1]).prepend(expand).click(function() {
                $(this).html("Fetching posts...");
                var threadid = $(this).parent().attr("id").substr(1);
                var link = protocol + "//boards.4chan.org/" + board + "/res/" + threadid;
                if(ext == 1)
                    chrome.runtime.sendMessage({'link': link, 'threadid': threadid }, extensionResponses);
                else
                    safari.self.tab.dispatchMessage("expand", {'link' : link, 'threadid' : threadid });
            });
        });
    }

    //Apply 'dynamic' features
    zoomify();

    //Autocheck preload all
    if(settings['autopreloading'] != "off" && ((!inThread && settings['autopreloading1'] != "off") || (inThread && settings['autopreloading2'] != "off"))) {
        $("#autodown").attr("checked", "true");
        autodown = true;
        preloadImages();
    }

    //Autoexpand all
    if(settings['autopreloading'] != "off" && ((!inThread && settings['autoexpand1'] != "off") || (inThread && settings['autoexpand2'] != "off"))) {
        $("#autoexpand").attr("checked", "true");
        autoexpand = true;
        expandAll();
    }
}

//try to make the reply box
function buildReplyBox() {
    var form = document.querySelectorAll('form')[0];
    //var formcontents = form.innerHTML;

    //if(formcontents.indexOf('id="recaptcha_response_field') < 0) {
    if(form && (!form.querySelector('iframe') || form.querySelector('iframe').src.indexOf('recaptcha') < 0)) {
        setTimeout(buildReplyBox, 100);
        return;
    }

    if(settings['quickreply'] != "off" && ((settings['quickreply1'] != "off" && !inThread) || (settings['quickreply2'] != "off" && inThread))) {
        //create box
        $("<div />").html('<div id="quickreplydrag"><h4 id="quicktitle">' + (inThread ? "Reply" : "New thread") +
            '</h4><img src="' + img.close + '" id="quickreplyclose" /></div>' +
            '<div id="quickreplydragform"></div>' +
            '<iframe id="quickreplyframe" name="quickreplyframe"></iframe><div id="message"><img src="' + img.load + '"> <span>Posting message...</span></div><div id="response"></div>')
            .attr({
                "id": "quickrep",
                "class": "reply"}).appendTo('body').hide();


        if(settings["hiderep"] == "on")
            $("#clone_postForm").show();

        //Cooldown reference
        $("#postform :submit").attr("id", "submitbutton");

        //hide box
        $("#quickreplyclose").click(function(e) {
            e.stopPropagation();
            hideQuickreply();
        });

        //draggable
        $("#quickreplydrag").mousedown(function(e) {
            e.stopPropagation();
            e.originalEvent.preventDefault();
            window.mousePos = [e.pageX, e.pageY];
            window.quickReplyOffset = $("#quickrep").offset();
            dragging = true;
        });

        //mousemove for dragging / mouseup for dragging / scroll for unread count
        $(document).mousemove(function(e) {
            e.stopPropagation();
            e.originalEvent.preventDefault();
            if(dragging) {
                var newMousePos = [e.pageX, e.pageY];
                $("#quickrep").css({
                    top: quickReplyOffset.top + newMousePos[1] - mousePos[1],
                    left: quickReplyOffset.left + newMousePos[0] - mousePos[0]
                });
            }
        }).mouseup(function() {
            //mouseup for dragging
            if(dragging)
                dragging = false;
        }).scroll(function() {
            //scroll for unread count
            if($(window).scrollTop() + $(window).height() == $(document).height() && settings["unread"] != "off") {
                unread = 0;
                document.title = title;
            }
        });

        //recaptcha refresh
        $("#clone_recaptcha_reload, #recaptcha_reload").click(function(e) {
            $("#recaptcha_response_field").attr("disabled", "true");
            recapreload = $("#clone_recaptcha_image > img").attr("src");
            setTimeout(isRefreshed, 50);
        });

        //Add progressbar
        if(settings['progress'] != "off") {
            var upfile = $("#quickrep input[name=upfile]");
            upfile.attr("id", "fileupload");
            $('<progress id="progress" max="100">').insertBefore(upfile);
        }

        //submit quick reply
        $("#postform").submit(function(e) {
            //use XHR instead of iframe for chrome
            if(ext == 1)
                e.preventDefault();

            //standard preloader
            if(settings['progress'] == "off")
                $("#message").show();

            //reset recaptcha
            $("#recaptcha_response_field").attr("disabled", "true");
            $("#recaptcha_reload").click();

            var vFD = new FormData(document.getElementById('postform'));

            //if(ext == 1) {
            //check if file is selected
            var uploadform = document.getElementById("postform");
            if(uploadform.elements["upfile"].value && settings['progress'] != "off") {
                $("#response, #fileupload").hide();
                $("#progress").show();
            } else {
                $("#response").hide();
                $("#message").show();
            }

            var oXHR = new XMLHttpRequest();
            oXHR.upload.addEventListener('progress', uploadProgress, false);
            //oXHR.addEventListener('load', uploadFinish, false);
            //oXHR.addEventListener('error', uploadError, false);
            //oXHR.addEventListener('abort', uploadAbort, false);
            oXHR.open('POST', $("#postform").attr("action"));
            oXHR.onreadystatechange = function (aEvt) {
                if (oXHR.readyState == 4) {
                    if(oXHR.status == 200) {
                        processPostResponse(oXHR.responseText);
                    } else {
                        console.log("Error loading page\n");
                    }
                }
            };
            oXHR.send(vFD);
            //}
        });
    }
}

//is recaptcha refreshed?
function isRefreshed() {
    var newsrc = $("#recaptcha_image > img").attr("src");
    if (newsrc != recapreload) {
        $("#clone_recaptcha_image").html($("#recaptcha_image").html());
        $("#clone_recaptcha_challenge_field").val($("#recaptcha_challenge_field").val());
        $("#clone_recaptcha_response_field").val("").focus();
        if(recaprefresh)
            clearTimeout(recaprefresh);
        recaprefresh = setTimeout(function() {
            $("#recaptcha_response_field").removeAttr("disabled");
        }, 200);
    } else {
        setTimeout(isRefreshed, 50);
    }
}

//update progress
function uploadProgress(e) {
    if(settings['progress'] != "off")
        $("#progress").val(Math.round(e.loaded / e.total * 100));
}

//Apply all features that influence posts and their content
function zoomify(element, fetched) {
    element = element ? element + " " : "";

    //hoverable / expandable images
    $(element + ".fileThumb").each(function() {
        //Get image info
        var fileID = $(this).parent().attr("id");
        var img = $(this).find("img");
        var old_src = img.attr("src");
        var new_src = $(this).attr("href");
        var fileinfo = $(this).parent().html().match(/, ([0-9]+)x([0-9]+)/);

        if(!fileinfo)
            return;

        var dimensions = [fileinfo[1], fileinfo[2]];

        //Increment loaded images
        images[1]++;

        files[fileID] = [settings['replaceSRC'] != "off" ? new_src : old_src, new_src, false, false, [img.width(), img.height()], dimensions];

        $(this).mouseover(function(e) {
            //hoverable
            if(settings['hoverable'] != "off") {
                var fileID = $(this).parent().attr("id");
                if(files[fileID][2])
                    return;
                var img = $(this).find("img");
                var new_src = $(this).attr("href");

                //spoiler?
                if($(this).is(".imgspoiler"))
                    files[fileID][6] = true;

                $("#popup").html("<img id='temp" + fileID + "' src='" + new_src + "' />").show().find("img").error(function() {
                    $("#popup").html("<img src='http://sys.4chan.org/error/404/rid.php' />");
                }).load(function() {
                    var fileID = $(this).attr("id").substr(4);

                    //replace src
                    if(settings['replaceSRC'] != "off" && !files[fileID][6])
                        img.attr("src", new_src);

                    //cound to loaded images
                    if(!files[fileID][3]) {
                        files[fileID][3] = true;
                        images[0]++;
                        $("#counter").html("(" + images[0] + "/" + images[1] + ")");
                    }
                });

                positionPopup([e.pageX, e.pageY], files[fileID][5]);
                showpopup = true;
            }
        }).mousemove(function(e) {
            if(showpopup)
                positionPopup([e.pageX, e.pageY]);
        }).mouseout(function() {
            //hide popup
            if(showpopup) {
                showpopup = false;
                $("#popup").hide();
            }
        }).click(function(e) {
            //expandable images
            if(settings['expandable'] != "off") {
                var fileID = $(this).parent().attr("id");

                if(showpopup) {
                    showpopup = false;
                    $("#popup").hide();
                }

                //Check for keys pressed
                if(e.ctrlKey || e.metaKey || e.altKey || e.which == 2)
                    return;
                else if(!dblclick)
                    e.preventDefault();

                if(files[fileID]) {
                    if(files[fileID][2]) {
                        //determine height difference
                        var thread = $(this).parents(".thread");
                        var nthread = thread.next();
                        var startHeight = nthread.offset().top - thread.offset().top;

                        //scale image back to thumbnail
                        $(this).html("<img src='" + files[fileID][0] + "' />").find("img")
                            .css({
                                width: files[fileID][4][0],
                                height: files[fileID][4][1]
                            });

                        //move window along
                        var pos = $(this).offset().top ;
                        if(window.pageYOffset > pos) {
                            var endHeight = nthread.offset().top - thread.offset().top;
                            pos2 = $(window).scrollTop() - (startHeight - endHeight);

                            window.scrollTo(window.pageXOffset, Math.max(pos - 24, pos2));
                        }
                    } else {
                        $(this).html("<img src='" + files[fileID][1] + "' class='expanded' />").find("img").load(function() {
                            var fileID = $(this).parent().parent().attr("id");
                            if(!files[fileID][3]) {
                                files[fileID][3] = true;
                                images[0]++;
                                $("#counter").html("(" + images[0] + "/" + images[1] + ")");
                            }
                        });

                        //screen size
                        if(settings['expandtype'] == 1) {
                            var screen = $(window).width();
                            var offset = $(this).offset().left;
                            var w = Math.min(screen - offset - 25, files[fileID][5][0]);
                            var h = files[fileID][5][1] * w / files[fileID][5][0];

                            if(settings['ignoreheight'] == "off" && h > $(window).height() - 50) {
                                h = $(window).height() - 50;
                                w = files[fileID][5][0] * h / files[fileID][5][1];
                            }

                            $(this).find("img").css({
                                width: w,
                                height: h
                            });
                        } else if(settings['expandtype'] == 2) {
                            //custom dimensions
                            var ow = files[fileID][5][0];
                            var oh = files[fileID][5][1];
                            var w = Math.min(settings['expandw'], files[fileID][5][0]);
                            var h = Math.min(settings['expandh'], files[fileID][5][1]);
                            var nh = oh * w / ow;
                            if(nh > settings['expandh'])
                                w = w * h / oh;
                            else
                                h = nh;
                            $(this).find("img").css({
                                width: w,
                                height: h
                            });
                        }
                    }

                    files[fileID][2] = files[fileID][2] ? false : true;
                }

                //doubleclick check
                if(settings['dblclickable'] != "off") {
                    dblclick = true;
                    setTimeout(function() {
                        dblclick = false;
                    }, 400);
                }
            }
        });
    });

    //Set image count for smartbar
    $("#counter").html("(" + images[0] + "/" + images[1] + ")");

    //Link activation / embed / postfilter (!)
    var locations = {};
    if(settings['embeds'] != "off" && ((settings['embeds1'] != "off" && !inThread)) || (settings['embeds2'] != "off" && inThread)) {
        //remove wbr
        $("wbr").remove();

        var node, allLinks=xpath((element == "" ? "." : "id('" + element.substr(1, element.length-2) + "')") + "//text()[ancestor::blockquote]");
        var length = allLinks.snapshotLength;
        for(var i=0; i<length; i++) {
            node=allLinks.snapshotItem(i);
            if(node != null)
                linkActivation(node);
        }
    }

    //hoverable quotes & backlinking
    if(settings['quotes'] != "off") {
        var fetchedBacklinks = {};

        $(element + ".quotelink").each(function() {
            //debug for mobile
            if($(this).hasClass("button"))
                return;

            //store for backlinking
            //find containing post
            if(settings['backlinking'] != "off" && ((settings['backlinking1'] != "off" && !inThread) || (settings['backlinking2'] != "off" && inThread)) && !fetched) {
                var threadID = inThread ? inThread[1] : $(this).parents(".thread").attr("id").substr(1);

                var owner = $(this).parent().parent().attr("id").substr(1);
                var id = $(this).attr("href").match(/[0-9]+$/);
                if(owner && id) {
                    var ref = id[0].toString();

                    if(!backlinks[ref])
                        backlinks[ref] = [[owner, threadID]];
                    else
                        backlinks[ref][backlinks[ref].length] = [owner, threadID];
                }
            }

            //backlinking for fetched posts
            if(settings['backlinking'] != "off" && fetched) {
                var owner = $(this).parent().parent().attr("id").substr(1);
                var id = $(this).attr("href").match(/[0-9]+$/);
                if(owner && id && !fetchedBacklinks[id]) {
                    fetchedBacklinks[id] = true;
                    var ref = id[0].toString();
                    var backlink = '<span id="bli_' + ref + '_' + owner + '"><a href="/' + board + '/res/' + inThread[1] + '#p' + owner + '" class="quotelink bcklink">&gt;&gt;' + owner + '</a></span>';

                    if(!backlinks[ref]) {
                        backlinks[ref] = [[owner, threadID]];
                        $("#p" + ref).append('<div class="backlinkHr"><hr></div><div id="bl_' + ref + '" class="backlink"><strong>Replies:</strong> ' + backlink + '</div>');
                    } else {
                        backlinks[ref][backlinks[ref].length] = [owner, threadID];
                        $("#bl_" + ref).append(backlink);
                    }

                    //hoverable backlinks
                    $("#bl_" + ref + " .bcklink").mouseover(function() {
                        var postID = $(this).html().match(/[0-9]+/);
                        $("#p" + postID).addClass("highlight");
                        $("#popup").html("<div class='quickpreview " + $("#p" + postID[0]).attr("class") + "'>" + $("#p" + postID[0]).html() + "</div>").show();
                        positionQuote($(this));
                    }).mouseout(function() {
                        var postID = $(this).html().match(/[0-9]+/);
                        $("#p" + postID).removeClass("highlight");
                        $("#popup").html("").hide();
                        showpopup = false;
                    });
                }
            }

            //mouse event for hover
            $(this).mouseover(function(e) {
                e.preventDefaault;
                showpopup = true;
                var popup = $("#popup");
                try{
                    var quoteinfoURL = new URL($(this).attr("href"));
                    if(quoteinfoURL.hash && (!quoteinfoURL.pathname || quoteinfoURL.pathname == "blank")){
                        var pathname = document.location.pathname +$(this).attr("href");
                    }
                    else{
                        var pathname = $(this).attr("href");
                    }
                    var quoteinfo = pathname.match(/(\/[a-z0-9]+)?(\/?res\/)?([0-9]+)#p([0-9]+)/);
                }
                catch(e){
                    return;
                }

                if(inThread) {
                    var threadID = $(".thread").attr("id").substr(1);
                    var opID = quoteinfo[3];
                    var postID = quoteinfo[4] ? quoteinfo[4] : quoteinfo[3];

                    if(quoteinfo[1]) {
                        //External board quote
                        var b = quoteinfo[1] ? quoteinfo[1] : board;
                        var link = protocol + "//boards.4chan.org/" + b + "/res/" + quoteinfo[3];
                        popup.html("<img src='" + img.load + "' />").show();
                        positionPopup([e.pageX, e.pageY]);
                        curextquote = $(this);
                        if(ext == 1)
                            chrome.runtime.sendMessage({'link': link, 'quote': postID }, extensionResponses);
                        else
                            safari.self.tab.dispatchMessage("externalQuote", {'link' : link, 'quote' : postID });
                    } else {
                        var opID = quoteinfo[3];
                        var postID = quoteinfo[4];

                        //regular quotes
                        if(opID == threadID) {
                            popup.html("<div class='quickpreview " + $("#p" + postID).attr("class") + "'>" + $("#p" + postID).html() + "</div>").show();
                            positionQuote($(this));
                        } else {
                            showpopup = false;
                        }
                    }
                } else {
                    //check if it's on board
                   // var quoteinfo = $(this).attr("href").match(/(\/[a-z0-9]+)?(\/?res\/)?([0-9]+)#p([0-9]+)/);
                    var postID = quoteinfo[4] ? quoteinfo[4] : quoteinfo[3];

                    if($("#p" + postID).length > 0) { //on board
                        popup.html("<div class='quickpreview " + $("#p" + postID).attr("class") + "'>" + $("#p" + postID).html() + "</div>").show();
                        positionQuote($(this));
                    } else { //external
                        var b = quoteinfo[1] ? quoteinfo[1] : board;
                        var link = protocol + "//boards.4chan.org/" + b + "/res/" + quoteinfo[3];
                        popup.html("<img src='" + img.load + "' />").show();
                        positionPopup([e.pageX, e.pageY]);
                        curextquote = $(this);
                        if(ext == 1)
                            chrome.runtime.sendMessage({'link': link, 'quote': postID }, extensionResponses);
                        else
                            safari.self.tab.dispatchMessage("externalQuote", {'link' : link, 'quote' : postID });
                    }
                }
            }).mouseout(function() {
                $("#popup").hide();
                showpopup = false;
                curextquote = false;
            });
        });
    }

    //add backlinks
    if(settings['backlinking'] != "off" && ((settings['backlinking1'] != "off" && !inThread) || (settings['backlinking2'] != "off" && inThread)) && !fetched) {
        for(backlink in backlinks) {
            var taken = {};
            var refs = ""
            var a = 2;
            for(i = 0; i < backlinks[backlink].length; i++) {
                if(taken[backlinks[backlink][i][0]])
                    continue;
                taken[backlinks[backlink][i][0]] = true;
                refs += '<span id="bli_' + backlink + '_' + backlinks[backlink][i][0] + '"><a href="/' + board + '/res/' + backlinks[backlink][i][1] + '#p' + backlinks[backlink][i][0] + '" class="quotelink bcklink">&gt;&gt;' + backlinks[backlink][i][0] + '</a></span>' + (a > 0 && a % 11 == 0 ? "<br />" : "");
                a++;
            }
            $("#p" + backlink).append('<div class="backlinkHr"><hr></div><div id="bl_' + backlink + '" class="backlink"><strong>Replies:</strong> ' + refs + '</div>');
        }

        //hoverable backlinks
        $(".bcklink").mouseover(function() {
            var postID = $(this).html().match(/[0-9]+/);
            $("#p" + postID).addClass("highlight");
            $("#popup").html("<div class='quickpreview " + $("#p" + postID[0]).attr("class") + "'>" + $("#p" + postID[0]).html() + "</div>").show();
            positionQuote($(this));
        }).mouseout(function() {
            var postID = $(this).html().match(/[0-9]+/);
            $("#p" + postID).removeClass("highlight");
            $("#popup").html("").hide();
            showpopup = false;
        });

        if(!inThread)
            backlinks = {};
    }

    //Clickable quotes for quickreply
    if(settings['quickreply'] != "off" && ((settings['quickreply1'] != "off" && !inThread) || (settings['quickreply2'] != "off" && inThread))) {
        $(element + ".postNum a:nth-child(2)").click(function(e) {
            //Find quoted post
            var quote = $(this).html();
            if(showquickreply && curquote == quote) {
                if(!inThread)
                    e.preventDefault();
                hideQuickreply();
                return;
            }
            curquote = quote;

            //on boards prevent following link and change box to reply instead of new thread
            if(!inThread) {
                e.preventDefault();
                var threadid = $(this).attr("href").match(/res\/([0-9]+)#q[0-9]+/);
                if(threadid)
                    resto = threadid[1];
                else {
                    var threadid = $(this).parent().find("a:first").attr("href").match(/res\/([0-9]+)#(q|p)[0-9]+/); //expanded post
                    resto = threadid[1];
                }

                if(!resto)
                    alert("KUT");

                $("#restofield").val(resto);
                $("#quicktitle").html("Reply");
            }

            //Add quote to cursor position
            var postform = document.getElementById("postform").com;
            postform.value = postform.value.substr(0, postform.selectionStart) + ">>" + quote + "\n" + postform.value.substr(postform.selectionStart);
            replybox = $("#quickrep");
            if(!showquickreply) {
                replybox.show();
                showquickreply = true;
            }
            var pos = $(this).offset();
            positionReplybox(pos.left, pos.top, false);
        });
    }



}

//Position the replybox
function positionReplybox(xoffset, yoffset, center) {
    var replybox = $("#quickrep");
    var maxi = window.innerWidth;

    recapreload = $("#clone_recaptcha_image > img").attr("src");
    var newsrc = $("#recaptcha_image > img").attr("src");
    if(recapreload != newsrc)
        $("#recaptcha_reload").click();

    replybox.css('left', Math.max(xoffset + 50, maxi - (maxi - (xoffset + 50))/2 - replybox.width()/4 * 3));
    if(center)
        replybox.css('top', document.body.scrollTop + window.innerHeight / 2 - replybox.height() / 2);
    else
        replybox.css('top', Math.min(yoffset, document.body.scrollHeight - replybox.height() - 150));
}

//Position the popup window
function positionPopup(mouse, dimensions) {
    var popup = $("#popup");

    if(dimensions) {
        w = dimensions[0];
        h = dimensions[1];
    } else {
        var w = popup.width();
        var h = popup.height() - 3;
    }

    var ww = $(window).width();
    var wh = $(window).height();

    if(h > wh - 40) {
        var nh = wh - 40;
        w = w * nh / h;
        h = nh;
    }
    if(w > ww - 40 - mouse[0]) {
        var nw = ww - 40 - mouse[0];
        h = h * nw / w;
        w = nw;
    }

    popup.css({
        top: Math.max(window.pageYOffset + 10, Math.min(mouse[1] - h/2, (window.pageYOffset + wh) - (30 + h))),
        left: mouse[0] + 10
    });

    if(dimensions) {
        $("#popup").children(":first").css({
            width: w,
            height: h
        });
    }
}

//position quote
function positionQuote(element) {
    var popup = $("#popup");
    var h = popup.height();
    var pos = element.offset();
    var toppos = pos.top - h - 10;

    if(toppos < window.pageYOffset)
        toppos = pos.top + 16;

    popup.css({
        top: toppos,
        left: pos.left
    });
}

//ONLY FOR SAFARI (xhr not supported)
function posted(response) {
    alert(response);
    $("#message").hide();
}

//Hide the quickreply window
function hideQuickreply() {
    $("#quickrep").hide();
    showquickreply = false;
    curquote = false;
    document.forms['post'].elements['com'].value = "";
    $("#fileupload").replaceWith('<input id="fileupload" name="upfile" type="file">');
    if(!inThread) {
        $("#restofield").val("");
        $("#quicktitle").html("New thread");
    }
}

//Thread refresher (request the page)
function refreshThread() {
    if(ext == 1) {
        chrome.runtime.sendMessage({'link': window.location.href, 'returnmsg': "pageModified" }, function(){
            extensionResponses(arguments[0])
        });
    } else
        safari.self.tab.dispatchMessage("refreshthread", { 'link' : window.location.href });
}

//Look for new posts in a requested page
function findNewPosts(newhtml) {
    //404
    if(newhtml == 404) {
        $(".board").append("<b>Thread 404'd after this.</b><hr />");
        document.title = "(404) " + title;

        speedyrefresh = false;
        clearTimeout(refresher);
        return;
    }

    //list all posts first time update is run (this way the extension is less heavy on page load)
    if(!threadposts) {
        threadposts = {};
        var html = document.getElementById("delform").innerHTML;
        reg = new RegExp('postContainer [a-z]+" id="pc([0-9]+)', "gi");

        while ((result = reg.exec(html)) !== null) {
            threadposts[result[1]] = true;
        }
    }

    //store html and look for new posts (moet nog checken op deleted!!)
    var $dom = $(newhtml);
    var newposts = [];
    $('.postContainer', $dom).each(function(){
        cur = $(this).attr("id").substr(2);
        //new posts! Temp store 'em
        if(!threadposts[cur]) {
            threadposts[cur] = true;
            newposts.push([cur, $(this)]);
        }
    });

    //add additional new posts to DOM
    if(newposts.length > 0) {
        //lean back mod
        var leanback = false;
        if(settings['leanbackmode'] != "off" && $(window).scrollTop() + $(window).height() == $(document).height() && windowfocus) {
            var leanback = true;
        }

        //Add posts to DOM
        for(i = 0; i < newposts.length; i++) {
            $(".thread").append(newposts[i][1]);
            zoomify("#pc" + newposts[i][0], true);
            if(autodown)
                preloadImages("#pc" + newposts[i][0]);
            if(autoexpand)
                expandAll("#pc" + newposts[i][0]);
        }

        //lean back mode
        if(leanback) {
            if(settings['leanbackreplies'] != "off") {
                var dif = $(document).height() - ($(window).scrollTop() + $(window).height());
                var quickReplyOffset = $("#quickrep").offset().top;

                $("#quickrep").animate({ top: quickReplyOffset + dif }, 250);
            }
            $("html, body").animate({ scrollTop: $(document).height() }, Math.min(500, refreshrate));
        }

        //unread posts
        if(!leanback && settings["unread"] != "off") {
            unread += newposts.length;
            document.title = "(" + unread + ") " + title;
        }

        //stop refreshing like a madman
        speedyrefresh = false;
        clearTimeout(refresher);
        refresher = setTimeout(function() {
            refreshThread();
        }, refreshrate);
    }

    //Reset thread updater
    clearTimeout(refresher);
    refresher = setTimeout(function() {
        refreshThread();
    }, speedyrefresh ? 500 : refreshrate);
}

//thread expansion
function expandThread(thread, html) {
    //404
    if(html == 404) {
        $("#t" + thread + " .summary").html("Thread 404'd");
        return;
    }

    //store reply button
    var replybutton = $("#pi" + thread).find(".postNum").html();

    //apply posts
    $("#t" + thread).html($(".thread", html).html().replace(/"([0-9]+#p[0-9]+)/gi, '"res/$1'));

    //put reply button back
    $("#pi" + thread).find(".postNum").html(replybutton);

    //apply features
    zoomify("#t" + thread);
    if(autodown)
        preloadImages("#t" + thread);
    if(autoexpand)
        expandAll("#t" + thread);

    //add retraction link
    $("#p" + thread + ", #t" + thread).append('<span class="summary desktop retr" id="ret' + thread + '"><img src="' + img.min + '" class="expand">Retract thread</span>')
        .find(".retr").click(function() {
            //hide replybox
            if(showquickreply)
                hideQuickreply();

            //hide posts / show buttons / scroll window
            var id = $(this).attr("id").substr(3);
            $("#t" + id + " > .replyContainer, #t" + id + " .retr, #t" + id + " .repl").hide();
            $("#exp" + id).show();
            window.scrollTo(0,  Math.min($("#t" + thread).offset().top, window.pageYOffset));
        });

    //add quick reply button
    $("#t" + thread).append('<span class="summary desktop repl" id="rep' + thread + '"><img src="' + img.replyicon + '" class="expand">Quick reply</span>')
        .find(".repl").click(function() {
            //hide?
            if(showquickreply) {
                hideQuickreply();
                return;
            }

            //set resto
            var threadid = $(this).attr("id").substr(3);
            resto = threadid;
            $("#restofield").val(resto);
            $("#quicktitle").html("Reply");

            //Add quote to cursor position
            replybox = $("#quickrep");
            if(!showquickreply) {
                replybox.show();
                showquickreply = true;
            }
            var pos = $(this).offset();
            positionReplybox(400, 0, true);
        });

    //add new expand link
    $("#t" + thread).append('<span class="summary desktop exp" id="exp' + thread + '"><img src="' + img.exp + '" class="expand">Expand thread</span>')
        .find(".exp").click(function() {
            var id = $(this).attr("id").substr(3);
            $("#t" + id + " > .replyContainer, #t" + id + " .retr, #t" + id + " .repl").show();
            $(this).hide();
        }).hide();
}

//external quote
function externalQuote(quote, html) {
    if(showpopup && curextquote) {
        var popup = $("#popup");
        var ref = $("#p" + quote, html);

        if(html == 404)
            popup.html("Thread 404'd").show();
        else
            popup.html("<div class='quickpreview " + ref.attr("class") + "'>" + ref.html() + "</div>").show();

        positionQuote(curextquote);
    }
    curextquote = false;
}

//Preload all images
function preloadImages(element) {
    element = element ? element + " " : "";

    $(element + ".fileThumb").each(function() {
        var fileID = $(this).parent().attr("id");
        var img = $(this).find("img");
        var old_src = img.attr("src");
        var new_src = $(this).attr("href");

        if(img.attr("alt") == "File deleted." || !files[fileID])
            return;

        if(files[fileID][2])
            return;

        //only preload spoilers, dont apply new src (also when src mustn't be replaced)
        if(settings['replaceSRC'] != "off" && !$(this).is(".imgspoiler")) {
            img.attr("src", new_src).load(function() {
                var fileID = $(this).parent().parent().attr("id");
                if(!files[fileID][3]) {
                    files[fileID][3] = true;
                    images[0]++;
                    $("#counter").html("(" + images[0] + "/" + images[1] + ")");
                }
            });
        } else {
            $("<img />").attr({
                "src": new_src,
                "id": "temp" + fileID
            }).load(function() {
                var fileID = $(this).attr("id").substr(4);
                if(!files[fileID][3]) {
                    files[fileID][3] = true;
                    images[0]++;
                    $("#counter").html("(" + images[0] + "/" + images[1] + ")");
                }
            });
        }
    });
}

//Expand all images
function expandAll(element) {
    element = element ? element + " " : "";

    $(element + ".fileThumb").each(function() {
        var fileID = $(this).parent().attr("id");

        //file deleted
        if(!files[fileID])
            return;

        if(!files[fileID][3]) {
            files[fileID][3] = true;
        }
        images[0] = images[1];
        $("#counter").html("(" + images[0] + "/" + images[1] + ")");

        if(files[fileID][5] && !$(this).is(".imgspoiler")) {
            $(this).html("<img src='" + files[fileID][1] + "' class='expanded' />");

            files[fileID][2] = true;

            //screen size
            if(settings['expandtype'] == 1) {
                var screen = $(window).width();
                var offset = $(this).offset().left;
                var w = Math.min(screen - offset - 25, files[fileID][5][0]);
                var h = files[fileID][5][1] * w / files[fileID][5][0];

                if(settings['ignoreheight'] == "off" && h > $(window).height() - 50) {
                    h = $(window).height() - 50;
                    w = files[fileID][5][0] * h / files[fileID][5][1];
                }

                $(this).find("img").css({
                    width: w,
                    height: h
                });
            } else if(settings['expandtype'] == 2) {
                //custom dimensions
                var ow = files[fileID][5][0];
                var oh = files[fileID][5][1];
                var w = Math.min(settings['expandw'], files[fileID][5][0]);
                var h = Math.min(settings['expandh'], files[fileID][5][1]);
                var nh = oh * w / ow;
                if(nh > settings['expandh'])
                    w = w * h / oh;
                else
                    h = nh;
                $(this).find("img").css({
                    width: w,
                    height: h
                });
            }
        }
    });
}

function linkActivation(node, inception) {
    var l, m;
    var txt = inception ? node.innerHTML : node.textContent;
    var span=null;
    var p=0;
    var found = {};

    while ( (m=links.exec(txt)) !== null) {
        if(found[m[0]])
            continue;

        found[m[0]] = true;

        if (null===span && !inception) {
            //create a span to hold the new text with links in it
            span=document.createElement('span');
        }

        //get the link without trailing dots
        l=m[0].replace(/\.*$/, '');

        if(inception && l.indexOf(inception) > -1)
            return l;
        else if(inception)
            continue;

        //put in text up to the link
        span.appendChild(document.createTextNode(txt.substring(p, m.index)));

        //create embed
        var replacement;
        var protocol = "http:";

        //long url (>35)
        if(l.length >= 34) {
            links.lastIndex = 0;
            /*var parent = node;
             for(i=0;i<10;i++) {
             if(parent.parentNode != null)
             parent = parent.parentNode;
             if(parent.nodeType)

             }*/
            var full = linkActivation(node.parentNode, l);
            if(full) {
                l = full;

                //chunk removal
                var chunks = Math.ceil(full.length / 35) - 1;
                for(var i=0;i<chunks;i++) {
                    var next = node.nextSibling;
                    if(next != null)
                        next.parentNode.removeChild(next);
                }
            }
        }

        if(l.match(/\.4chan\.org/i)) //4chan
            continue;
        else if((youtube = l.match(/youtube\.com\/watch\?.*?v=([a-z0-9-_#!]+)/i)) && ((settings['youtube1'] != "off" && !inThread) || (settings['youtube2'] != "off" && inThread))) { //youtube
            replacement = '<br /><iframe class="youtube-player" type="text/html" width="640" height="385" src="' + protocol + '//www.youtube.com/embed/' + youtube[1] + '?wmode=opaque" frameborder="0"></iframe><br /><a href="' + l + '" target="_blank">' + l + '</a>';
        } else if((vocaroo = l.match(/vocaroo\.com\/(i\/|\?media=)([a-z0-9]+)/i)) && ((settings['vocaroo1'] != "off" && !inThread) || (settings['vocaroo2'] != "off" && inThread))) //vocaroo
            replacement = '<br /><object type="application/x-shockwave-flash" style="width: 148px; height: 44px" data="http://vocaroo.com/player.swf?playMediaID=' + vocaroo[2] + '&server=m1.vocaroo.com&autoplay=0""><param name="wmode" value="opaque"><param name="movie" value="http://vocaroo.com/player.swf?playMediaID=' + vocaroo[2] + '&server=m1.vocaroo.com&autoplay=0"></object><br /><a href="' + l + '" target="_blank">' + l + '</a>';
        else if((soundcloud = l.match(/((www\.)?soundcloud\.com\/([a-z0-9-_]+\/?)+)/i)) && ((settings['soundcloud1'] != "off" && !inThread) || (settings['soundcloud2'] != "off" && inThread))) //soundcloud
            replacement = '<br /><object height="81" width="400"><param name="movie" value="http://player.soundcloud.com/player.swf?url=http://' + soundcloud[1] + '&amp;g=bb"></param><param name="wmode" value="opaque"><param name="allowscriptaccess" value="always"></param><embed allowscriptaccess="always" height="81" src="http://player.soundcloud.com/player.swf?url=http://' + soundcloud[1] + '&amp;g=bb" type="application/x-shockwave-flash" width="400"></embed></object><br /><a href="http://' + soundcloud[1] + '" target="_blank">http://' + soundcloud[1] + '</a>';
        else if(l.indexOf("@") > -1 && ((settings['email1'] != "off" && !inThread) || (settings['email2'] != "off" && inThread))) //email
            replacement = "<a href='mailto:" + l + "'>" + l + "</a>";
        else if((settings['links1'] != "off" && !inThread) || (settings['links2'] != "off" && inThread) && l.indexOf("@") < 0) {
            var l2 = l.match(/^http/i) ? l : "http://" + l;
            replacement = "<a href='" + l2 + "' target='_blank'>" + l + "</a>";
        } else
            replacement = l;

        var activated = document.createElement('span');
        activated.innerHTML = replacement;
        span.appendChild(activated);
        //track insertion point
        p=m.index+m[0].length;
    }

    if(inception)
        return false;

    if (span) {
        //take the text after the last link
        span.appendChild(document.createTextNode(txt.substring(p, txt.length)));
        //replace the original text with the new span
        try {
            node.parentNode.replaceChild(span, node);
        } catch (e) {
            console.error(e);
        }
    }
}

function xpath(query) {
    return document.evaluate(query, document, null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}
}