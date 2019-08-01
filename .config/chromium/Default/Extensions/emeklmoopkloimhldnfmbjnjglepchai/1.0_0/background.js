var defaults = 	[
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
var modified = 0;

for(i = 0; i < defaults.length; i++) {
    if(!localStorage[defaults[i][0]])
        localStorage[defaults[i][0]] = defaults[i][1];
}

//Hidden threads
if(!localStorage["hiddenThreads"])
    localStorage["hiddenThreads"] = "none";
else {
    var hiddenThreads = localStorage["hiddenThreads"].split("{}");
    localStorage["hiddenThreads"] = "none";
    localStorage["progress"] = "on";

    for(var i = 1; i < hiddenThreads.length; i++) {
        var hidden = hiddenThreads[i].split("[]");
        if(hidden[1] > Math.round(new Date().getTime() / 1000 / 60 / 60) - 72) {
            localStorage["hiddenThreads"] += "{}" + hidden[0] + "[]" + hidden[1];
        }
    }
}

if(!localStorage["autonoko"])
    localStorage["autonoko"] = "on";

function laadPag(callback, link, sender, action) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", link, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var response = {	name: sender,
                message: xhr.responseText,
                action: action ? action : false
            };

            if(xhr.status == 404)
                response.message = 404;

            callback({ message: response, name: sender });
        }
    }
    xhr.send();
};

function checkHeaders(callback, link, sender) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', link + '?_dc=' + Math.random().toFixed(20).replace('.', ''), true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var updated = new Date(xhr.getResponseHeader("Last-Modified")).getTime();
            var response = {};
            if(updated > modified) {
                modified = updated;
                response["updated"] = true;
            } else
                response["updated"] = false;

            response["status"] = xhr.status;

            response["name"] = sender;
            response["lastModified"] = modified;

            callback({ message: response, name: sender });
        }
    };
    xhr.send();
}

function onRequest(request, sender, callback) {
    //external quote
    if(request.link && request.quote){
        laadPag(callback, request.link, "extquote", request.quote);
        return true;
    }


    //Get settings
    if(request.getOptions) {
        callback({name: "settings", message: localStorage});
    }

    //Set setting
    if(request.setValue) {
        localStorage[request.field] = request.setValue;
    }

    //request page (thread updater)
    if(request.link && request.returnmsg == "pageModified") {
        checkHeaders(callback, request.link, request.returnmsg);
        return true;
    }

    //request page (thread updater)
    if(request.link && request.returnmsg == "newposts") {
        laadPag(callback, request.link, request.returnmsg);
        return true;
    }

    //request thread for expansion
    if(request.link && request.threadid){
        laadPag(callback, request.link, "expansion", request.threadid);
        return true;
    }

    if(request.response) {
        chrome.tabs.sendRequest(sender.tab.id, { response : request.response });
    }
}
chrome.runtime.onMessage.addListener(onRequest);

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-77088330-5']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();