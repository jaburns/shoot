define(function(require){
  var modes = [ CameraMode, MoveMode, PencilMode, EraserMode, CurveMode, PolyMode ];

  var Level = require('../shared/level');
  var renderLevel = require('./renderLevel');

  function Editor (window, context, ready) {
    this.camera = {x:0, y:0};
    this.context = context;

    this.level = new Level;
    this.level.solids = [[
      {"x":100,"y":100,"c":false},{"x":191,"y":438,"c":true},{"x":502,"y":432,"c":true},
      {"x":630,"y":285,"c":false},{"x":726,"y":177,"c":true},{"x":751,"y":199,"c":true},
      {"x":935,"y":284,"c":false},{"x":1036,"y":339,"c":false},{"x":1249,"y":339,"c":false},
      {"x":1249,"y":712,"c":false},{"x":10,"y":714,"c":false},{"x":12,"y":100,"c":false}
    ]];

    this._mode = new CameraMode (this);
    this._mouse = {x:0, y:0};
    this._icons = new Image ();
    this._icons.onload = ready;
    this._icons.src = '/gfx/editor-icons.png';

    window.onmousedown = function(e) {
      if (e.pageX < 64) {
        if (e.pageY < 64*modes.length) {
          this._mode = new modes[~~(e.pageY/64)] (this);
        } else if (e.pageY < 64*(modes.length+1)) {
          window.prompt ("Level data:", JSON.stringify (this.level.solids));
        }
      } else if (this._mode.onmousedown) {
        this._mode.onmousedown (e.pageX,e.pageY);
      }
    }.bind(this);

    window.onmousemove = function(e) {
      this._mouse.x = e.pageX;
      this._mouse.y = e.pageY;
      if (this._mode.onmousemove) {
        this._mode.onmousemove (e.pageX,e.pageY);
      }
    }.bind(this);

    window.onmouseup = function(e) {
      if (this._mode.onmouseup) {
        this._mode.onmouseup (e.pageX,e.pageY);
      }
    }.bind(this);
  }

  function ptDist2 (a,b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return dx*dx + dy*dy;
  }


  Editor.prototype.render = function () {
    var ctx = this.context;
    var canTouchPoints = !(this._mode instanceof CameraMode);

    // This code renders the collision map for the first solid.
//      ctx.fillStyle = '#ddd';
//      ctx.beginPath();
//      ctx.moveTo(qq[0].x, qq[0].y);
//      for (var i = 0; i < qq.length; i++) {
//        ctx.lineTo(qq[i].x, qq[i].y);
//      }
//      ctx.fill();
//      return;

    // Draw the terrain.
    renderLevel (ctx,this.camera,this.level);

    // Draw all the editor handles.
    for (var i = 0; i < this.level.solids.length; i++) {
    for (var j = 0; j < this.level.solids[i].length; j++) {
      var ptMinusCamera = {
        x: this.level.solids[i][j].x - this.camera.x + ctx.canvas.width/2,
        y: this.level.solids[i][j].y - this.camera.y + ctx.canvas.height/2
      };
      if (canTouchPoints && ptDist2 (ptMinusCamera,this._mouse) < 10*10) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#ff4';
      } else if (j === 0 || j === this.level.solids[i].length-1) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#4f4';
      } else if (this.level.solids[i][j].c) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#88f';
      } else {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#f44';
      }
      ctx.beginPath();
      ctx.arc(ptMinusCamera.x, ptMinusCamera.y, 5, 0, 2*Math.PI);
      ctx.stroke();
    }}

    // Draw the toolbox.
    for (var i = 0; i < modes.length; ++i) {
      var sx = this._mode instanceof modes[i] ? 64 : 0;
      var sy = 64 * modes[i].iconIndex;
      var dy = 64 * i;
      ctx.drawImage(this._icons, sx, sy, 64, 64, 0, dy, 64,64);
    }
    // Draw save icon
    ctx.drawImage(this._icons, 0, 32, 64, 64, 0, dy+64, 64,64);
  }

  Editor.prototype.getPointIndexUnderMouse = function () {
    for (var i = 0; i < this.level.solids.length; i++) {
    for (var j = 0; j < this.level.solids[i].length; j++) {
      var ptMinusCamera = {
        x: this.level.solids[i][j].x - this.camera.x + ctx.canvas.width/2,
        y: this.level.solids[i][j].y - this.camera.y + ctx.canvas.height/2
      };
      if (ptDist2 (ptMinusCamera,this._mouse) < 10*10) {
        return {i:i, j:j};
      }
    }}
    return null;
  }

  Editor.prototype.getPointUnderMouse = function () {
    var index = this.getPointIndexUnderMouse ();
    if (index) return this.level.solids[index.i][index.j];
    return null;
  }

  Editor.prototype.deletePointAt = function (index) {
    if (! index) return;
    var i = index.i, j = index.j;
    this.level.solids[i].splice(j,1);
    if (this.level.solids[i].length < 3) {
      this.level.solids.splice(i,1);
    }
  }

  Editor.prototype.insertPointAfter = function (index) {
    if (! index) return;
    var i = index.i, j = index.j;
    var pt = this.level.solids[i][j];
    var newPt = {x:pt.x, y:pt.y, c:false};
    this.level.solids[i].splice (j+1,0,newPt);
    return newPt;
  }

  Editor.prototype.toggleCurveModeAt = function (index) {
    if (! index) return;
    var i = index.i, j = index.j;
    var pt = this.level.solids[i][j];
    if (pt.c) {
      pt.c = false;
    } else {
      // A curve anchor must not be the first or last vertex in a solid.
      if (j === 0 || j === this.level.solids.length-1) return;
      // A point may become a curve anchor if it's neither preceded nor followed by 2 curve anchors.
      if (j > 1 && this.level.solids[i][j-1].c && this.level.solids[i][j-2].c) return;
      if (j < this.level.solids.length-2 && this.level.solids[i][j+1].c && this.level.solids[i][j+2].c) return;

      pt.c = true;
    }
  }

  Editor.prototype.addPoly = function (x,y) {
    this.level.solids.push ([
      {x: x-50, y: y+50, c: false},
      {x: x-50, y: y-50, c: false},
      {x: x+50, y: y-50, c: false},
      {x: x+50, y: y+50, c: false}
    ]);
  }

// Editor mode definitions ----------------------------------------------------
  // CameraMode - Move the view around
  // MoveMode - Move vertices
  // PencilMode - Create vertices
  // EraserMode - Remove vertices
  // CurveMode - Toggle curve control vertices
  // PolyMode - Create new polygons

  function CameraMode (editor) {
    this._editor = editor;
    this._startDrag = null;
  }
  CameraMode.iconIndex = 0;
  CameraMode.prototype.onmousedown = function (x,y) {
    this._startDrag = {
      x: x + this._editor.camera.x,
      y: y + this._editor.camera.y
    };
  }
  CameraMode.prototype.onmousemove = function (x,y) {
    if (this._startDrag) {
      this._editor.camera.x = this._startDrag.x - x;
      this._editor.camera.y = this._startDrag.y - y;
    }
  }
  CameraMode.prototype.onmouseup = function (x,y) {
    this._startDrag = null;
  }

  function MoveMode (editor) {
    this._editor = editor;
    this._currentDragPoint = null;
  }
  MoveMode.iconIndex = 0;
  MoveMode.prototype.onmousedown = function (x,y) {
    this._currentDragPoint = this._editor.getPointUnderMouse ();
  }
  MoveMode.prototype.onmousemove = function (x,y) {
    if (this._currentDragPoint) {
      this._currentDragPoint.x = x + this._editor.camera.x - this._editor.context.canvas.width/2;
      this._currentDragPoint.y = y + this._editor.camera.y - this._editor.context.canvas.height/2;
    }
  }
  MoveMode.prototype.onmouseup = function (x,y) {
    if (this._currentDragPoint) {
      this._currentDragPoint = null;
    }
  }

  function PencilMode (editor) {
    this._editor = editor;
  }
  PencilMode.iconIndex = 1;
  PencilMode.prototype = new MoveMode (null);
  PencilMode.prototype.onmousedown = function (x,y) {
    this._currentDragPoint = this._editor.insertPointAfter(
      this._editor.getPointIndexUnderMouse ()
    );
  }

  function EraserMode (editor) {
    this._editor = editor;
  }
  EraserMode.iconIndex = 2;
  EraserMode.prototype.onmousedown = function (x,y) {
    this._editor.deletePointAt(
      this._editor.getPointIndexUnderMouse ()
    );
  }

  function CurveMode (editor) {
    this._editor = editor;
  }
  CurveMode.iconIndex = 1;
  CurveMode.prototype.onmousedown = function (x,y) {
    this._editor.toggleCurveModeAt(
      this._editor.getPointIndexUnderMouse ()
    );
  }

  function PolyMode (editor) {
    this._editor = editor;
  }
  PolyMode.iconIndex = 0;
  PolyMode.prototype.onmousedown = function (x,y) {
    this._editor.addPoly(
      x + this._editor.camera.x - this._editor.context.canvas.width/2,
      y + this._editor.camera.y - this._editor.context.canvas.height/2
    );
  }

// ----------------------------------------------------------------------------

  var ctx = document.getElementById('paper').getContext('2d');
  var editor = new Editor (window, ctx, loop);

  function loop () {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    editor.render ();
    requestAnimationFrame (loop);
  }
});
