if (typeof define !== 'function') {
  var define = function (f) { module.exports = f (require); }
}

define(function(require) {
  'use strict';

  var Vec2 = require('./vec2');
  var geom = require('./geom');

  var SEG_LENGTH = 50;
  var LEN_MEASURE_PRECISION = 20;

  function Collision (level) {
    this._lines = getLines (level);
  }

  function getLines (level) {
    var curves = level.getCurves(0);
    var pts = [curves[0][0]];

    for (var i = 1; i < curves.length; ++i) {
      if (curves[i].length < 2) {
        pts.push (curves[i][0]);
        continue;
      }
      var ptsIn = [ curves[i-1][curves[i-1].length-1] ].concat (curves[i]);
      var len = geom.bezierLength (ptsIn, LEN_MEASURE_PRECISION);
      var segs = ~~(len / SEG_LENGTH);
      for (var j = 1; j <= segs; ++j) {
        pts.push (geom.bezier (ptsIn, j / segs));
      }
    }
    pts.push (curves[0][0]);

    return pts;
  }

  Collision.prototype._circleCollision = function (x,y,r) {
    var lines = this._lines;
    var r2 = r*r;
    var lined = false;
    var normal = null;
    var restore = null;

    for (var i = 0; i < lines.length - 1; i++) {
      var ax = lines[i].x;
      var ay = lines[i].y;
      var bx = lines[i+1].x;
      var by = lines[i+1].y;

      if (geom.pointInLinePerpSpace (ax, ay, bx, by, x, y)) {
        var m  = (by-ay)/(bx-ax);
        var lx = x-ax;
        var ly = y-ay;

        var pointOnLine = geom.projectPointOnLine (m, lx, ly);
        var projection = pointOnLine.clone().scale(-1);

        projection.x += lx;
        projection.y += ly;

        if (projection.magnitude2() < r2) {
          normal = projection.clone.normalize();
          if (projection.cross (new Vec2 (bx - ax, by - ay)) > 0) {
            normal.scale(-1);
          }
          restore = (new Vec2(ax,ay))
            .add(pointOnLine)
            .add(normal.clone().scale(radius));

          x = restore.x;
          y = restore.y;
          lined = true;
        }
      }
    }

    if (lined) return {
      normal: normal,
      restore: restore
    };

    return null;

    // There was no collision with the edge of a local line, test against local points.
    /*
    foreach (var line in lines) {
        var deltaA = new Vector2 (x - line.A.x, y - line.A.y);
        if (deltaA.sqrMagnitude < r2) {
            normal = deltaA.normalized;
            restore = new Vector2 (line.A.x, line.A.y) + r * normal;
            return true;
        }
        var deltaB = new Vector2 (x - line.B.x, y - line.B.y);
        if (deltaB.sqrMagnitude < r2) {
            normal = deltaB.normalized;
            restore = new Vector2 (line.B.x, line.B.y) + r * normal;
            return true;
        }
    }
    */
  }

  Collision.prototype._sweepCircleCollision = function (x0,y0,x1,y1,r) {
    var r2 = r * r;
    var dx = x1 - x0;
    var dy = y1 - y0;
    var d2 = dx*dx + dy*dy;

    var col = this._circleCollision (x1,y1,r);
    if (col) return col;
    if (d2 < r2) return null;

    var dist = Math.sqrt (d2);
    var stepx = r * (dx / dist);
    var stepy = r * (dy / dist);

    do {
      x0 += stepx;
      y0 += stepy;

      col = this._circleCollision (x0,y0,r);
      if (col) return col;

      dx = x1 - x0;
      dy = y1 - y0;
    }
    while (dx*dx + dy*dy >= r2);

    return this._circleCollision (x1,y1,r);
  }

  Collision.prototype.step = function (pos,vel,radius) {
    var pos2 = {
      x: pos.x + vel.x,
      y: pos.y + vel.y
    };

    var collisionResult = this._circleCollision (pos2.x,pos2.y,radius);

    if (collisionResult) {
      return {
        pos: collisionResult.restore,
        vel: (new Vec2(vel)).reflect (collisionResult.normal, 1, 1);
      };
    }
    return {
      pos: pos2,
      vel: vel
    };
  }

  return Collision;
});
