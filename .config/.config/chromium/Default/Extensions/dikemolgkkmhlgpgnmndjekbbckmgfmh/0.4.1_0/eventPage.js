/*global document: false, chrome: false */
/*jslint browser: true, indent: 2, plusplus: true*/
document.addEventListener('DOMContentLoaded', function () {

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    chrome.tabs.query({}, function (tabs) {
      var EMPTY_FUNCTION = function (response) { };
      for (var i = tabs.length - 1; i >= 0; i--) {
        chrome.tabs.sendMessage(tabs[i].id, request, EMPTY_FUNCTION);
      }
    });
  });

});
