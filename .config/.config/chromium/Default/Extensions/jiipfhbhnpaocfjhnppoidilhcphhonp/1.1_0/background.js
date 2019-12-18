chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        return {
            redirectUrl: 'http://reddit.com/r/' + details.url.match(/^http:\/\/r\/(.+)/i)[1]
        };
    },
    {
        urls: ["*://r/*"]
    },
    ["blocking"]
);