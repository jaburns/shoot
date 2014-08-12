if (typeof define !== 'function') {
  define = function (f) { module.exports = f (require); }
}

define(function(require) {
  'use strict'

  function State () {
    this.players = [];
  }

  function Player (id) {
    this.id = id;
    this.pos = {x:0, y:0};
    this.vel = {x:0, y:0};
    this.standing = false;
  }

  function Button () {
    this.down = false;
    this.up = false;
    this.held = false;
  }

  function Input () {
    this.left = new Button ();
    this.right = new Button ();
    this.jump = new Button ();
    this.shoot = new Button ();
  }

  function stepPlayer (input, player) {
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

  function mainStep (inputs, oldState) {
    var newState = new State ();

    for (var i = 0; i < oldState.players.length; ++i) {
      for (var k in inputs) {
        if (oldState.players[i].id == k) {
          newState.players.push (stepPlayer (inputs[k], oldState.players[i]));
          delete inputs[k];
        }
      }
    }

    for (k in inputs) {
      newState.players.push (new Player (k));
    }

    return newState;
  }

  return {
    dt: 50,
    players: 5,
    initialState: new State (),
    defaultInput: new Input (),
    step: mainStep
  };
});
