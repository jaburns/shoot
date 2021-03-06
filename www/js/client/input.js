define(function(require) {
  'use strict'

  var keyCodes = {
    '65': 'left',  // A
    '68': 'right', // D
    '87': 'jump',  // W
    '32': 'shoot', // Space
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
