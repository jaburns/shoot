if (typeof define !== 'function') {
  var define = function (f) { module.exports = f (require); }
}

define(function(require) {
  'use strict'

  return function (input, player, state) {
    if (input.left.held) {
      player.vel.x -= 0.002;
    } else if (input.right.held) {
      player.vel.x += 0.002;
    } else {
      player.vel.x *= 0.9;
    }

    player.pos.x += player.vel.x;
    player.pos.y += player.vel.y;

    return player;
  }
});
