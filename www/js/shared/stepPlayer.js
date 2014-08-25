if (typeof define !== 'function') {
  var define = function (f) { module.exports = f (require); }
}

define(function(require) {
  'use strict'

  var levelData = require('./levelData');
  var Vec2 = require('./vec2');

  return function (input, player, state) {
    var level = levelData[state.level];

    player.vel.y += 0.5;

    if (input.left.held) {
      player.vel.x -= 0.6;
      player.seatAngle.target = -Math.PI / 8;
    } else if (input.right.held) {
      player.vel.x += 0.6;
      player.seatAngle.target = Math.PI / 8;
    } else {
      player.vel.x *= 0.98;
      player.seatAngle.target = 0;
    }

    player.seatAngle.value +=
      (player.seatAngle.target - player.seatAngle.value) / 3;

    player.wheel.omega = player.vel.x / 15;
    player.wheel.theta += player.wheel.omega;

    if (player !== state.players[0]) {
      for (var i = 0; i < state.players.length; i++) {
        var p = state.players[i];
        if (p === player) continue;
        var d = new Vec2 (player.pos.x - p.pos.x, player.pos.y - p.pos.y);
        if (d.magnitude2() < 30*30) {
          var dmag = d.magnitude();
          d.normalize().scale(15 - 0.5*dmag);
          player.pos.x += d.x;
          player.pos.y += d.y;
          p.pos.x -= d.x;
          p.pos.y -= d.y;
        }
      }
    }

    var collided = level.collision.step (player.pos, player.vel, 15);

    player.pos = collided.pos;
    player.vel = collided.vel;

    return player;
  }
});
