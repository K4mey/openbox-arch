/*global document: false, chrome: false, window: false*/
/*jslint browser: true, indent: 2, plusplus: true, vars: true*/
(function () {

  var processor, volume, handleYoutube,
    Event = {ScriptLoad: 0, LoadDBvalues: 1, DomLoaded: 2};

  var EventHandler = (function () {
    var eventInstances = [false, false], alreadyEventFired = false;

    function register(event) {
      if (alreadyEventFired) {
        return;
      }
      eventInstances[event] = true;
      for (var i = eventInstances.length - 1; i >= 0; i--) {
        if (eventInstances[i] === false) {
          return;
        }
      }
      //all events are registered
      processor();
      alreadyEventFired = true;
    }

    function listenFor(event) {
      eventInstances[event] = false;
    }

    return {
      register: register,
      listenFor: listenFor
    };

  }());

  chrome.storage.sync.get({master_volume: 10, handleYoutube: true}, function (obj) {
    handleYoutube = obj.handleYoutube;
    volume = obj.master_volume / 100.0;
    EventHandler.register(Event.LoadDBvalues);
  });

  function setVolume(elems) {
    for (var i = elems.length - 1; i >= 0; i--) {
      elems[i].volume = volume;
      elems[i].dataset.vc = 'y';
    }
  }

  function coreFunctionality(videoSelectorClass) {
    var elems = document.querySelectorAll(videoSelectorClass),
      iframes = document.querySelectorAll("iframe:not([data-crossorigin='y'])");
    setVolume(elems);
    for (var i = iframes.length - 1; i >= 0; i--) {
      try {
        elems = iframes[i].contentDocument.querySelectorAll(videoSelectorClass);
        setVolume(elems);
      } catch (e) { //if accessing iframe contentDocument throws exception
        iframes[i].dataset.crossorigin = 'y';
      }
    }
  }




  /*
   * Feed Processor is used for sites which has multiple videos in a page
   * Ex: Facebook, Twitter, web.whatsap, etc.
   */
  function feedProcessor() {
    var fastInterval, slowInterval, firstExecution = true;
    function main(intervalType, videoSelectorClass) {
      if (firstExecution && intervalType === "SLOW") {
        firstExecution = false;
        clearInterval(fastInterval);
      }
      coreFunctionality(videoSelectorClass);
    }
    slowInterval = setInterval(main, 1000, "SLOW", "video:not([data-vc='y']) , audio:not([data-vc='y'])");
    fastInterval = setInterval(main, 100,  "FAST", "video , audio");
  }




  /*
   * Youtube saves the volume value and resets the value now and then.
   * Performance: max 0.1ms
   */
  function youtubeProcessor() {
    if (!handleYoutube) {
      return;
    }
    var elems;

    //UI element is dependent on the youtube css class name
    function setupControls() {
      var span = document.querySelector('.ytp-mute-button').parentNode;
      span.innerHTML = '<input id="vc-custom-adjuster" type="range" min="0" ' +
        'max="100" style="position: relative;top: -8px;">';
      var range = document.getElementById('vc-custom-adjuster');
      range.value = volume * 100;
      range.addEventListener('input', function () {
        volume = range.value / 100;
      });

      document.querySelector('.html5-video-player').addEventListener('keydown', function (e) {
        var tempVol;
        if (e.keyCode === 38) {
          tempVol = volume + 0.05;
          volume = (tempVol > 1) ? 1 : tempVol;
        } else if (e.keyCode === 40) {
          tempVol = volume - 0.05;
          volume = (tempVol < 0) ? 0 : tempVol;
        } else if (e.keyCode === 77) {
          volume = (volume === 0) ? 0.1 : 0;
        }
        range.value = volume * 100;
      });
    }

    //In youtube main page the video element will not be present
    function checkForVideoLoad() {
      elems = document.getElementsByTagName('video');
      if (elems.length === 0) {
        setTimeout(checkForVideoLoad, 100);
        return false;
      }
      setInterval(setVolume, 10, elems);
      setupControls();
    }

    checkForVideoLoad();
  }
  /**
   * On global level volume change, update the volume adjuster created manually
   */
  function onVolumeChange_youtube() {
    var range = document.getElementById('vc-custom-adjuster');
    if (range) {
      range.value = volume * 100;
    }
  }




  /*
   * On volume change request
   */
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.changeVolume === true) {
      volume = request.volume;
      //!!should stop hardcode check
      if (processor === youtubeProcessor) {
        if (handleYoutube) {
          onVolumeChange_youtube();
        } else {
          return;
        }
      }
      coreFunctionality('video , audio');
    }
  });



  //Set the processor
  processor = feedProcessor;
  var exceptionalSites = [{regex: /^http?.*youtube\.com.*$/i, processor: youtubeProcessor}];
  for (var i = exceptionalSites.length - 1; i >= 0; i--) {
    if (exceptionalSites[i].regex.test(window.location.href)) {
      processor = exceptionalSites[i].processor;
      break;
    }
  }

  //add the listenFor event before calling any register(event)
  if (processor === youtubeProcessor) {
    EventHandler.listenFor(Event.DomLoaded);
  }
  EventHandler.register(Event.ScriptLoad);




  var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);
      EventHandler.register(Event.DomLoaded);
    }
  }, 10);

}());
