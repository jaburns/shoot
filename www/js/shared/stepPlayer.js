if (typeof define !== 'function') {
  var define = function (f) { module.exports = f (require); }
}

define(function(require) {
  'use strict'

  return function (input, player, state) {
    if (input.left.held) {
      player.vel.x -= 0.2;
      player.seatAngle.target = -Math.PI / 8;
    } else if (input.right.held) {
      player.vel.x += 0.2;
      player.seatAngle.target = Math.PI / 8;
    } else {
      player.vel.x *= 0.98;
      player.seatAngle.target = 0;
    }

    player.seatAngle.value +=
      (player.seatAngle.target - player.seatAngle.value) / 10;

    player.pos.x += player.vel.x;

    player.wheel.omega = player.vel.x / 15;
    player.wheel.theta += player.wheel.omega;

    if (player.pos.x < -300 + 15) {
        player.pos.x = -300 + 15;
        player.vel.x = 0;
    }
    else if (player.pos.x > 300 - 15) {
        player.pos.x = 300 - 15;
        player.vel.x = 0;
    }

    return player;
  }
});
