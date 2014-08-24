if (typeof define !== 'function') {
  var define = function (f) { module.exports = f (require); }
}

define(function(require) {
  'use strict';

  function Vec2 (x,y) {
    this.set (x,y);
  }

  Vec2.prototype.set = function (x,y) {
    if (typeof x === 'object') {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
    return this;
  }

  Vec2.prototype.setPolar = function (r,rads) {
    this.x = r * Math.cos (rads);
    this.y = r * Math.sin (rads);
    return this;
  }


  Vec2.prototype.magnitude = function () {
    return Math.sqrt (this.x*this.x + this.y*this.y);
  }

  Vec2.prototype.magnitude2 = function () {
    return this.x*this.x + this.y*this.y;
  }


  Vec2.prototype.clone = function () {
    return new Vec2 (this.x, this.y);
  }

  Vec2.prototype.toString = function () {
    return "{x:"+x+", y:"+y+"}";
  }


  Vec2.prototype.add = function (vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }

  Vec2.prototype.sub = function (vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }

  Vec2.prototype.scale = function (x) {
    this.x *= x;
    this.y *= x;
    return this;
  }

  Vec2.prototype.dot = function (vec) {
    return this.x*vec.x + this.y*vec.y;
  }

  Vec2.prototype.cross = function (vec) {
    return this.x*vec.y - this.y*vec.x;
  }

  Vec2.prototype.crossZ = function (z) {
    var ox = this.x;
    this.x = z*this.y;
    this.y = -z*ox;
    return this;
  }

  Vec2.prototype.normalize = function () {
    return this.scale (1 / this.magnitude ());
  }


  Vec2.prototype.rotate = function (rads) {
    var cos = Math.cos (rads);
    var sin = Math.sin (rads);
    var ox = this.x;
    this.x = ox * cos - this.y * sin;
    this.y = ox * sin + this.y * cos;
  }

  Vec2.prototype.rotate90 = function () {
    var ox = this.x;
    this.x = -this.y;
    this.y = ox;
  }

  Vec2.prototype.rotateBack90 = function () {
    var ox = this.x;
    this.x = this.y;
    this.y = -ox;
  }


  Vec2.prototype.reflect = function (unitNormal, normalScale, tangentScale) {
    var unitTangent = unitNormal.clone().rotate90();

    var normComponent = this.dot (unitNormal);
    var tangComponent = this.dot (unitTangent);

    normComponent *= -normalScale;
    tangComponent *=  tangentScale;

    this.set(unitNormal).scale(normComponent).plus(
      unitTangent.scale(tangComponent)
    );

    return this;
  }


  return Vec2;
});
