define(function(require) {
return function (ctx, smoothingCheckbox) {
  'use strict'

  var game = require('../shared/game');
  var levelData = require('../shared/levelData');
  var renderLevel = require('./renderLevel');

  function makeWheel (color1, color2) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = 32;
    canvas.height = 32;
    ctx.beginPath();
    ctx.arc(16, 16, 15, 0, Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = color1;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(16, 16, 15, Math.PI, 0, false);
    ctx.closePath();
    ctx.fillStyle = color2;
    ctx.fill();
    return function (ctx, x, y, theta) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(theta);
      ctx.drawImage(canvas, -16, -16);
      ctx.restore();
    }
  }

  function makeSeat (color) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = 30;
    canvas.height = 29;
    ctx.lineWidth=7;
    ctx.lineCap='round';
    ctx.strokeStyle='#3996E8';
    ctx.beginPath();
    ctx.moveTo(15,25);
    ctx.lineTo(15,5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(15-11,4);
    ctx.lineTo(15+11,4);
    ctx.stroke();
    return function (ctx, x, y, theta) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(theta);
      ctx.drawImage(canvas, -15, -25);
      ctx.restore();
    }
  }

  var camera = {x:0,y:0};

  var drawWheel = makeWheel ('#C13FFF', '#7F3FFF');
  var drawSeat = makeSeat ('#3996E8');

  function drawPlayer (ctx, player) {
    var centerX = ctx.canvas.width/2;
    var centerY = ctx.canvas.height/2;
    drawWheel (ctx, player.pos.x-camera.x+centerX, player.pos.y-camera.y+centerY, player.wheel.theta);
    drawSeat  (ctx, player.pos.x-camera.x+centerX, player.pos.y-camera.y+centerY, player.seatAngle.value);
  }

  var pid;

  var state0;
  var state1;
  var stateArriveTime = null;
  var DT = 50;

  function renderState (state) {
    for (var i in state.players) {
      drawPlayer (ctx, state.players[i]);
      if (state.players[i].id === pid) {
        camera = state.players[i].pos;
      }
    }

    // TODO cache rendered level in a hidden canvas element.
    renderLevel (ctx, camera, levelData[state.level]);
  }

  function renderLoop () {
    ctx.canvas.width = ctx.canvas.width;

    if (smoothingCheckbox.checked && state0 && state1) {
      var t = (new Date - stateArriveTime) / DT;
      var interState = gamesync.json.lerp (state0, state1, t);
      renderState (interState);
    }
    else if (! smoothingCheckbox.checked && state1) {
      renderState (state1);
    }

    window.requestAnimationFrame (renderLoop);
  }
  window.requestAnimationFrame (renderLoop);

  return function (state, id) {
    pid = id;
    state0 = state1 ? state1 : null;
    state1 = state;
    stateArriveTime = new Date;
  }
}});
