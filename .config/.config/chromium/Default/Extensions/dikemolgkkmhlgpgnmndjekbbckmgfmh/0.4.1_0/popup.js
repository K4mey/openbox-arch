/*global document: false, chrome: false, window: false*/
/*jslint browser: true, indent: 2, plusplus: true*/
document.addEventListener('DOMContentLoaded', function () {

  var VOLUME_STEP_MODES = {
      LINEAR_1: function(increase) {
          return 1;
      },
      LINEAR_2: function(increase) {
          return 2;
      },
      EXPONENTIAL: function(increase) {
          if(volume >= 16) return 4;
          if(volume >= 8) return 2;
          if(volume >= 2) return 1;
          if(volume == 1 && increase) return 1;
          return 0.5;
      }
  };

  var volume = 10,
    oldVolume = volume,
    show_audio_tabs_default = true,
    vol_slider = document.getElementById('vol_slider'),
    vol_value_container = document.getElementById('vol_val_container'),
    vol_icon = document.getElementById('vol_icon'),
    tab_info_container = document.getElementById('audible_tabs_container'),
    tab_info_container_animator = document.createElement('div'),
    expand = document.getElementById('expand'),
    volume_stepper = VOLUME_STEP_MODES.EXPONENTIAL,
    EMPTY_FUNCTION = function (response) { },
    show_whats_new = false;

  tab_info_container_animator.className = 'tab_info_container_animator';

  function setUI() {
    vol_icon.className = (volume === 0) ? 'icon mute' : 'icon unmute';
    vol_value_container.innerHTML = volume + '%';
    vol_slider.value = volume;
  }

  chrome.storage.sync.get({master_volume: 10, show_audio_tabs_default: true, volume_stepper: 'EXPONENTIAL',
    show_whats_new_04: true}, function (obj) {
      volume = oldVolume = obj.master_volume;
      show_audio_tabs_default = obj.show_audio_tabs_default;
      volume_stepper = VOLUME_STEP_MODES[obj.volume_stepper];
      show_whats_new = obj.show_whats_new_04;
      setUI();
      if(show_audio_tabs_default) {
        expand.click();
      }
  });

  setInterval(function() {
    if(volume != oldVolume) {
      oldVolume = volume;
      chrome.runtime.sendMessage({changeVolume: true, volume: volume/100.0}, EMPTY_FUNCTION);
      setUI();
      chrome.storage.sync.set({'master_volume': volume});
    }
  }, 20);

  vol_slider.addEventListener('click', function () { volume = vol_slider.value; });
  vol_slider.addEventListener('immediate-value-change', function () { volume = vol_slider.immediateValue; });
  vol_icon.addEventListener('click', function () { volume = (volume === 0) ? 10 : 0; });

  document.getElementById('settings').addEventListener('click', function () {
    window.open(chrome.extension.getURL("options.html"));
  });

  var currentWindowId = 0, currentTabId = 0;
  chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
    currentWindowId = arrayOfTabs[0].windowId;
    currentTabId = arrayOfTabs[0].id;
  });

  expand.addEventListener('click', function () {
    expand.parentNode.removeChild(expand);
    document.querySelector('.volume_controller_divider').className = 'volume_controller_divider show';
    tab_info_container.className = 'show';
    document.getElementById('settings').className = 'icon show';

    function add_navigate_listener(tabInfo, tab) {
      tabInfo.addEventListener('dblclick', function () {
        if (tab.windowId !== currentWindowId) {
          chrome.windows.update(tab.windowId, {focused: true});
        }
        chrome.tabs.update(tab.id, {active: true});
      });
    }

    chrome.tabs.query({audible: true}, function (tabs) {
      for (var i = tabs.length - 1; i >= 0; i--) {

        var tabInfo_title = document.createElement('div');
        tabInfo_title.innerHTML = tabs[i].title;
        tabInfo_title.className = 'tabInfo_title';

        var favIcon = document.createElement("img");
        favIcon.src = tabs[i].favIconUrl;
        favIcon.className = 'favIcon';

        var tabInfo = document.createElement('div');
        tabInfo.className = 'tabInfo';
        tabInfo.title = tabs[i].title;
        tabInfo.appendChild(favIcon);
        tabInfo.appendChild(tabInfo_title);

        add_navigate_listener(tabInfo, tabs[i]);
        if (tabs[i].id === currentTabId && tab_info_container_animator.childNodes.length > 0) {
          //should be first in the list
          tab_info_container_animator.insertBefore(tabInfo, tab_info_container_animator.childNodes[0]);
        } else {
          tab_info_container_animator.appendChild(tabInfo);
        }
        if (tabs[i].id === currentTabId) {
          tabInfo.style.opacity = '1';
          tabInfo_title.innerHTML = '<div title="Current tab" class="current_tab"></div>' + tabInfo_title.innerHTML;
        }
      }
      if (tabs.length === 0) {
        tab_info_container_animator.innerHTML = '<div class="tabInfo no_media_info">' +
         '-- No media playing right now! --</div>';
      }
      tab_info_container.appendChild(tab_info_container_animator);
    });

      if(show_whats_new) {
          var div = document.createElement('div');
          div.style.textAlign = 'center';
          var button = document.createElement('button');
          button.innerHTML = 'Got it!';
          button.title = 'Dont show this again';
          div.innerHTML = '<span><a href="options.html" target="_blank">What\'s new in this version?</a></span>';
          button.addEventListener('click', function() {
              chrome.storage.sync.set({'show_whats_new_04': false});
              div.parentNode.removeChild(div);
          });
          div.appendChild(button);
          document.body.appendChild(div);
      }
  });

  document.addEventListener('keydown', function(e) {
    if (e.keyCode == 40) {
      if(volume > 0) volume -= volume_stepper(false);
      volume = volume < 0 ? 0 : volume;
    } else if(e.keyCode == 38) {
      if(volume < 100) volume += volume_stepper(true);
      volume = volume > 100 ? 100 : volume;
    } else if(e.keyCode == 77 || e.keyCode == 109) {
        volume = (volume == 0) ? 10 : 0;
    }
  });
});
