define(function(require) {
  'use strict'

  var game = require ('shared/game');
  var render = require ('client/render');
  var getInput = require ('client/input');

  runGame (game, render, getInput);
});
