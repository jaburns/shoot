define(function(require) {
  'use strict'

  // ----- input ----------------------------------------------------------------

  function objHas (obj, value) {
    for (var k in obj) {
      if (obj[k] === value) return true;
    }
    return false;
  }

  var getInput = (function(){
    var keyCodes = {
      "37": "left",
      "39": "right",
      "65": "jump",
      "66": "shoot",
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
  })();

  //
  // ----- view -----------------------------------------------------------------

  var render = (function(){
    var WIDTH = 640, HEIGHT = 300;
    var WIDTH2 = WIDTH/2, HEIGHT2 = HEIGHT/2;

    var ctx = document.getElementById('paper').getContext('2d');
    var scoreHeader = document.getElementById('score');
    var fg = '#FFF', bg = '#000';

    function drawPlayer (player) {
      ctx.fillStyle = fg;
      ctx.fillRect (WIDTH2+WIDTH2*player.pos.x-3,
                    HEIGHT2+HEIGHT2*player.pos.y-3, 6, 6);
    }

    return function (state) {
      ctx.fillStyle = bg;
      ctx.fillRect (0, 0, WIDTH, HEIGHT);
      for (var i = 0; i < state.players.length; ++i) {
        drawPlayer (state.players[i]);
      }
    }
  })();

  // ----------------------------------------------------------------------------

  var game = require ('./game');
  runGame (game, render, getInput);
});
