if (typeof define !== 'function') {
  var define = function (f) { module.exports = f (require); }
}

define(function(require) {
  'use strict';

  function Level () {
    this.solids = [[
      {"x":100,"y":100,"c":false},{"x":191,"y":438,"c":true},{"x":502,"y":432,"c":true},
      {"x":630,"y":285,"c":false},{"x":726,"y":177,"c":true},{"x":751,"y":199,"c":true},
      {"x":935,"y":284,"c":false},{"x":1036,"y":339,"c":false},{"x":1249,"y":339,"c":false},
      {"x":1249,"y":712,"c":false},{"x":10,"y":714,"c":false},{"x":12,"y":100,"c":false}
    ]];
  }

  function bezier (pts,t) {
    var u = 1 - t;
    if (pts.length < 3) return {
      x: u*pts[0].x + t*pts[1].y,
      y: u*pts[0].y + t*pts[1].y
    };
    if (pts.length < 4) return {
      x: u*u*pts[0].x + 2*u*t*pts[1].x + t*t*pts[2].x,
      y: u*u*pts[0].y + 2*u*t*pts[1].y + t*t*pts[2].y
    };
    if (pts.length < 5) return {
      x: u*u*u*pts[0].x + 3*u*u*t*pts[1].x + 3*u*t*t*pts[2].x + t*t*t*pts[3].x,
      y: u*u*u*pts[0].y + 3*u*u*t*pts[1].y + 3*u*t*t*pts[2].y + t*t*t*pts[3].y
    };
    return null;
  }

  Level.prototype.getLines = function () {

  }

  return Level;
});
