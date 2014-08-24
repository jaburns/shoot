if (typeof define !== 'function') {
  var define = function (f) { module.exports = f (require); }
}

define(function(require) {
  'use strict';

  /**
   * Given the coordinates of the end points of two line segments, this function returns
   * their intersection point, or null if they do not intersect.
   */
  var geom = {
    lineIntersect: function (p00x, p00y, p01x, p01y, p10x, p10y, p11x, p11y) {
      var dx1x3 = p00x - p10x;
      var dy1y3 = p00y - p10y;
      var dx2x1 = p01x - p00x;
      var dy2y1 = p01y - p00y;
      var dx4x3 = p11x - p10x;
      var dy4y3 = p11y - p10y;

      var denom = dy4y3*dx2x1 - dx4x3*dy2y1;
      var numa  = dx4x3*dy1y3 - dy4y3*dx1x3;
      var numb  = dx2x1*dy1y3 - dy2y1*dx1x3;

      if (denom === 0) return null;

      numa /= denom;
      numb /= denom;

      if (numa >= 0 && numa <= 1 && numb >= 0 && numb <= 1) {
        return {
          x: p00x + dx2x1*numa,
          y: p00y + dy2y1*numa
        };
      }

      return null;
    },

    /**
     * Returns true if the supplied point (x,y) lies in the space bounded by two
     * infinite lines which intersect the points defining the provided line segment, and
     * are perpendicular to the provided line segment.
     */
    pointInLinePerpSpace: function (ax, ay, bx, by, x, y) {
      var _ax, _ay;
      var _bx, _by;
      var _cx, _cy;

      float perpSlope = (ax-bx)/(by-ay);

      // If the slope is greater than 1, transpose the coordinate space to avoid infinity.
      if (perpSlope > 1) {
        _ax = ay; _bx = by; _cx = y;
        _ay = ax; _by = bx; _cy = x;
        perpSlope = (_ax-_bx)/(_by-_ay);
      } else {
        _ax = ax; _bx = bx; _cx = x;
        _ay = ay; _by = by; _cy = y;
      }

      float yMin, yMax;

      if (_ay > _by) {
        yMin = perpSlope*(_cx - _bx) + _by;
        yMax = perpSlope*(_cx - _ax) + _ay;
      } else {
        yMin = perpSlope*(_cx - _ax) + _ay;
        yMax = perpSlope*(_cx - _bx) + _by;
      }

      return _cy > yMin && _cy < yMax;
    }
  };

  return geom;
});

