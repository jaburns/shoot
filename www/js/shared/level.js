if (typeof define !== 'function') {
  var define = function (f) { module.exports = f (require); }
}

define(function(require) {
  'use strict';

  var geom = require('./geom');

  function Level () {
    this.solids = [[
      {"x":100,"y":100,"c":false},{"x":191,"y":438,"c":true},{"x":502,"y":432,"c":true},
      {"x":630,"y":285,"c":false},{"x":726,"y":177,"c":true},{"x":751,"y":199,"c":true},
      {"x":935,"y":284,"c":false},{"x":1036,"y":339,"c":false},{"x":1249,"y":339,"c":false},
      {"x":1249,"y":712,"c":false},{"x":10,"y":714,"c":false},{"x":12,"y":100,"c":false}
    ]];
  }

  var SEG_LENGTH = 10;
  var LEN_MEASURE_PRECISION = 20;

  Level.prototype.getCurves = function (solidIndex) {
    var solid = this.solids[solidIndex];
    var ret = [[ solid[0] ]];

    for (var i = 1; i < solid.length; ) {
      if (i < solid.length - 2 && solid[i].c && solid[i+1].c) {
        ret.push ([ solid[i], solid[i+1], solid[i+2] ]);
        i += 3;
      }
      else if (i < solid.length - 1 && solid[i].c) {
        ret.push ([ solid[i], solid[i+1] ]);
        i += 2;
      }
      else {
        ret.push ([ solid[i] ]);
        i++;
      }
    }

    return ret;
  }

  Level.prototype.getLines = function () {
    var curves = this.getCurves(0);
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

    return pts;
  }

  return Level;
});
