if (typeof define !== 'function') {
  var define = function (f) { module.exports = f (require); }
}

define(function(require) {
  'use strict'

  var st = require('./state');
  var stepPlayer = require('./stepPlayer');

  function mainStep (inputs, oldState) {
    var newState = new st.State ();

    // For all the players which we've receive inputs for, step them forwards.
    for (var i = 0; i < oldState.players.length; ++i) {
      for (var k in inputs) {
        if (oldState.players[i].id == k) {
          newState.players.push (stepPlayer (inputs[k], oldState.players[i], oldState));
          delete inputs[k];
        }
      }
    }

    // For all the inputs with no coresponding player object, add a new player
    // to the game.
    for (k in inputs) {
      newState.players.push (new st.Player (k));
    }

    return newState;
  }

  return {
    dt: 50,
    players: 5,
    initialState: new st.State (),
    defaultInput: new st.Input (),
    step: mainStep
  };
});
