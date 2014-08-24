define(function(require){
  var modes = [ CameraMode, MoveMode, PencilMode, EraserMode, CurveMode, PolyMode ];

  function Editor (window, context, ready) {
    this.camera = {x:0, y:0};

    this._solids = [[
      {"x":100,"y":100,"c":false},{"x":191,"y":438,"c":true},{"x":502,"y":432,"c":true},
      {"x":630,"y":285,"c":false},{"x":726,"y":177,"c":true},{"x":751,"y":199,"c":true},
      {"x":935,"y":284,"c":false},{"x":1036,"y":339,"c":false},{"x":1249,"y":339,"c":false},
      {"x":1249,"y":712,"c":false},{"x":10,"y":714,"c":false},{"x":12,"y":100,"c":false}
    ]];

    this._mode = new CameraMode (this);
    this._context = context;
    this._mouse = {x:0, y:0};
    this._icons = new Image ();
    this._icons.onload = ready;
    this._icons.src = '/gfx/editor-icons.png';

    window.onmousedown = function(e) {
      if (e.pageX < 64) {
        if (e.pageY < 64*modes.length) {
          this._mode = new modes[~~(e.pageY/64)] (this);
        } else if (e.pageY < 64*(modes.length+1)) {
          window.prompt ("Level data:", JSON.stringify (this._solids));
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
    var ctx = this._context;
    var canTouchPoints = !(this._mode instanceof CameraMode);

    // Draw the solid chunks of terrain.
    ctx.fillStyle = '#ddd';
    for (var i = 0; i < this._solids.length; i++) {
      ctx.beginPath();

      // TODO Use Level class method .getCurves();

      ctx.moveTo(
        this._solids[i][0].x - this.camera.x,
        this._solids[i][0].y - this.camera.y);

      for (var j = 1; j < this._solids[i].length; ) {
        if (j < this._solids[i].length - 2
        && this._solids[i][j].c
        && this._solids[i][j+1].c) {
          ctx.bezierCurveTo(
            this._solids[i][j].x - this.camera.x,
            this._solids[i][j].y - this.camera.y,
            this._solids[i][j+1].x - this.camera.x,
            this._solids[i][j+1].y - this.camera.y,
            this._solids[i][j+2].x - this.camera.x,
            this._solids[i][j+2].y - this.camera.y);
          j += 3;
        }
        else if (j < this._solids[i].length - 1
        && this._solids[i][j].c) {
          ctx.quadraticCurveTo(
            this._solids[i][j].x - this.camera.x,
            this._solids[i][j].y - this.camera.y,
            this._solids[i][j+1].x - this.camera.x,
            this._solids[i][j+1].y - this.camera.y);
          j += 2;
        }
        else {
          ctx.lineTo(
            this._solids[i][j].x - this.camera.x,
            this._solids[i][j].y - this.camera.y);
          j++;
        }
      }

      ctx.fill();
    }

    // Draw all the points in the map.
    for (var i = 0; i < this._solids.length; i++) {
    for (var j = 0; j < this._solids[i].length; j++) {
      var ptMinusCamera = {
        x: this._solids[i][j].x - this.camera.x,
        y: this._solids[i][j].y - this.camera.y
      };
      if (canTouchPoints && ptDist2 (ptMinusCamera,this._mouse) < 10*10) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#ff4';
      } else if (j === 0 || j === this._solids[i].length-1) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#4f4';
      } else if (this._solids[i][j].c) {
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
    for (var i = 0; i < this._solids.length; i++) {
    for (var j = 0; j < this._solids[i].length; j++) {
      var ptMinusCamera = {
        x: this._solids[i][j].x - this.camera.x,
        y: this._solids[i][j].y - this.camera.y
      };
      if (ptDist2 (ptMinusCamera,this._mouse) < 10*10) {
        return {i:i, j:j};
      }
    }}
    return null;
  }

  Editor.prototype.getPointUnderMouse = function () {
    var index = this.getPointIndexUnderMouse ();
    if (index) return this._solids[index.i][index.j];
    return null;
  }

  Editor.prototype.deletePointAt = function (index) {
    if (! index) return;
    var i = index.i, j = index.j;
    this._solids[i].splice(j,1);
    if (this._solids[i].length < 3) {
      this._solids.splice(i,1);
    }
  }

  Editor.prototype.insertPointAfter = function (index) {
    if (! index) return;
    var i = index.i, j = index.j;
    var pt = this._solids[i][j];
    var newPt = {x:pt.x, y:pt.y, c:false};
    this._solids[i].splice (j+1,0,newPt);
    return newPt;
  }

  Editor.prototype.toggleCurveModeAt = function (index) {
    if (! index) return;
    var i = index.i, j = index.j;
    var pt = this._solids[i][j];
    if (pt.c) {
      pt.c = false;
    } else {
      // A curve anchor must not be the first or last vertex in a solid.
      if (j === 0 || j === this._solids.length-1) return;
      // A point may become a curve anchor if it's neither preceded nor followed by 2 curve anchors.
      if (j > 1 && this._solids[i][j-1].c && this._solids[i][j-2].c) return;
      if (j < this._solids.length-2 && this._solids[i][j+1].c && this._solids[i][j+2].c) return;

      pt.c = true;
    }
  }

  Editor.prototype.addPoly = function (x,y) {
    this._solids.push ([
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
      this._currentDragPoint.x = x + this._editor.camera.x;
      this._currentDragPoint.y = y + this._editor.camera.y;
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
      x + this._editor.camera.x,
      y + this._editor.camera.y
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
