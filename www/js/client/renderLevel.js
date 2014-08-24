define(function(require) {
  'use strict';

  return function (ctx,camera,level) {
    var centerX = ctx.canvas.width / 2;
    var centerY = ctx.canvas.height / 2;

    ctx.save();
    ctx.fillStyle = '#ddd';

    for (var i = 0; i < level.solids.length; i++) {
      var curves = level.getCurves(i);

      ctx.beginPath();
      ctx.moveTo(
        curves[0][0].x - camera.x + centerX,
        curves[0][0].y - camera.y + centerY
      );

      for (var j = 1; j < curves.length; ++j) {
        switch (curves[j].length) {
          case 3:
            ctx.bezierCurveTo(
              curves[j][0].x - camera.x + centerX,
              curves[j][0].y - camera.y + centerY,
              curves[j][1].x - camera.x + centerX,
              curves[j][1].y - camera.y + centerY,
              curves[j][2].x - camera.x + centerX,
              curves[j][2].y - camera.y + centerY
            );
            break;
          case 2:
            ctx.quadraticCurveTo(
              curves[j][0].x - camera.x + centerX,
              curves[j][0].y - camera.y + centerY,
              curves[j][1].x - camera.x + centerX,
              curves[j][1].y - camera.y + centerY
            );
            break;
          case 1:
            ctx.lineTo(
              curves[j][0].x - camera.x + centerX,
              curves[j][0].y - camera.y + centerY
            );
            break;
        }
      }

      ctx.fill();
    }

    ctx.restore();
  }
});



