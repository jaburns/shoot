define(function(require) {
  'use strict'

  function objHas (obj, value) {
    for (var k in obj) {
      if (obj[k] === value) return true;
    }
    return false;
  }

  var keyCodes = {
    '37': 'left',
    '39': 'right',
    '65': 'jump',
    '66': 'shoot',
  };

  var keys = {
    left: { up: false, down: false, held: false },
    right: { up: false, down: false, held: false },
    jump: { up: false, down: false, held: false },
    shoot: { up: false, down: false, held: false }
  };

  var dirty = false;

  window.onkeydown = function (e) {
    if (Object.keys (keyCodes).indexOf (e.keyCode.toString()) < 0) return;
    keys [keyCodes [e.keyCode]].down = true;
    keys [keyCodes [e.keyCode]].held = true;
    keys [keyCodes [e.keyCode]].up = false;
    dirty = true;
  }

  window.onkeyup = function (e) {
    if (Object.keys (keyCodes).indexOf (e.keyCode.toString()) < 0) return;
    keys [keyCodes [e.keyCode]].down = false;
    keys [keyCodes [e.keyCode]].held = false;
    keys [keyCodes [e.keyCode]].up = true;
    dirty = true;
  }

  return function () {
    if (! dirty) return null;
    dirty = false;

    var keysClone = JSON.parse (JSON.stringify (keys));

    for (var k in keys) {
      if (keys[k].down) {
        keys[k].down = false;
        dirty = true;
      }
      if (keys[k].up) {
        keys[k].up = false;
        dirty = true;
      }
    }

    return keysClone;
  }
});
