/*global document: false, chrome: false*/
/*jslint browser: true, indent: 2, plusplus: true*/
document.addEventListener('DOMContentLoaded', function () {

  var timeout,
    handleYoutube_checkbox = document.getElementById('handleYoutube_checkbox'),
    show_audio_tabs_default_checkbox = document.getElementById('show_audio_tabs_default'),
    volume_stepper_dropdown = document.getElementById('volume_stepper'),
    saveButton = document.getElementById('save_button'),
    actionStatus = document.getElementById('action_status');

  chrome.storage.sync.get({handleYoutube: true, show_audio_tabs_default: true, volume_stepper: 'EXPONENTIAL'}, function (obj) {
    handleYoutube_checkbox.checked = obj.handleYoutube;
    show_audio_tabs_default_checkbox.checked = obj.show_audio_tabs_default;
    volume_stepper_dropdown.value = obj.volume_stepper;
  });

  function clearStatus() {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(function () {
      actionStatus.innerHTML = '';
    }, 2000);
  }

  saveButton.addEventListener('click', function () {
    chrome.storage.sync.set({
        'handleYoutube': handleYoutube_checkbox.checked,
        'show_audio_tabs_default': show_audio_tabs_default_checkbox.checked,
        'volume_stepper': volume_stepper_dropdown.value
    }, function () {
      actionStatus.innerHTML = 'Saved successfully!';
      clearStatus();
    });
  });

});
