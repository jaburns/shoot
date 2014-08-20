define(function(require) {
  'use strict'

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

  var drawWheel = makeWheel ('#C13FFF', '#7F3FFF');
  var drawSeat = makeSeat ('#3996E8');

  function drawPlayer (ctx, player) {
    drawWheel (ctx, player.pos.x+300, 35, player.wheel.theta);
    drawSeat (ctx, player.pos.x+300, 35, player.seatAngle.value);
  }

  return function (ctx) {
    return function (state) {
      ctx.canvas.width = ctx.canvas.width;
      console.log (state.players);
      for (var i = 0; i < state.players.length; ++i) {
        drawPlayer (ctx, state.players[i]);
      }
    }
  }
});
