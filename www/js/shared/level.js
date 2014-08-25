if (typeof define !== 'function') {
  var define = function (f) { module.exports = f (require); }
}

define(function(require) {
  'use strict';

  var geom = require('./geom');
  var Collision = require('./collision');

  function Level (data) {
    this.solids = data.solids;
    this.collision = new Collision (this);
  }

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

  return Level;
});
