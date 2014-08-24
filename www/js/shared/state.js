if (typeof define !== 'function') {
  var define = function (f) { module.exports = f (require); }
}

define(function(require) {
  'use strict';

  var st = {};

  st.State = function () {
    this.level = 0;
    this.players = [];
  }

  st.Player = function (id) {
    this.id = id;
    this.pos = {x:0, y:0};
    this.vel = {x:0, y:0};
    this.wheel = {theta:0, omega:0};
    this.seatAngle = {target:0, value:0};
  }

  st.Button = function () {
    this.down = false;
    this.up = false;
    this.held = false;
  }

  st.Input = function () {
    this.left = new st.Button ();
    this.right = new st.Button ();
    this.jump = new st.Button ();
    this.shoot = new st.Button ();
  }

  return st;
});

