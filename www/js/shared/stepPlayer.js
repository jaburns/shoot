if (typeof define !== 'function') {
  var define = function (f) { module.exports = f (require); }
}

define(function(require) {
  'use strict'

  var levelData = require('./levelData');

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

    player.pos.x += player.vel.x;

    player.wheel.omega = player.vel.x / 15;
    player.wheel.theta += player.wheel.omega;

    var collided = level.collision.step (player.pos, player.vel, 15);

    player.pos = collided.pos;
    player.vel = collided.vel;

    return player;
  }
});
