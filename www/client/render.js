define(function(require) {
  'use strict'

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
});
