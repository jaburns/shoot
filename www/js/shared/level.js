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

  Level.prototype.getLines = function () {

  }

  return Level;
});
