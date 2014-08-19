define(function(require){

    function Editor (window, context, ready) {
        this.camera = {x:0, y:0};

        this._solids= [[
            {x:100,y:100,c:false},
            {x:200,y:100,c:true},
            {x:200,y:200,c:true},
            {x:100,y:200,c:false}
        ]];
        this._mode = new CameraMode (this);
        this._context = context;
        this._mouse = {x:0, y:0};
        this._icons = new Image ();
        this._icons.onload = ready;
        this._icons.src = '/gfx/editor-icons.png';

        window.onmousedown = function(e) {
            var modes = [ CameraMode, MoveMode, PencilMode, EraserMode, CurveMode ];
            if (e.pageX < 64 && e.pageY < 64*modes.length) {
                for (var i = 0; i < modes.length; ++i) {
                    if (~~(e.pageY/64) === i) {
                        this._mode = new modes[i] (this);
                    }
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
            } else if (j === 0) {
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
        ctx.drawImage(this._icons, this._mode instanceof CameraMode ?64:0,0,64,64,0,0,64,64);
        ctx.drawImage(this._icons, this._mode instanceof MoveMode ?64:0,64,64,64,0,64,64,64);
        ctx.drawImage(this._icons, this._mode instanceof PencilMode ?64:0,128,64,64,0,128,64,64);
        ctx.drawImage(this._icons, this._mode instanceof EraserMode ?64:0,64,64,64,0,192,64,64);
        ctx.drawImage(this._icons, this._mode instanceof CurveMode ?64:0,128,64,64,0,256,64,64);
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
        var newPt = {x:pt.x, y:pt.y, c:pt.c};
        this._solids[i].splice (j+1,0,newPt);
        return newPt;
    }

// Editor mode definitions ----------------------------------------------------
    // CameraMode - Move the view around
    // MoveMode - Move vertices
    // PencilMode - Create vertices
    // EraserMode - Remove vertices
    // CurveMode - Toggle curve control vertices

    function CameraMode (editor) {
        this._editor = editor;
        this._startDrag = null;
    }
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
    PencilMode.prototype = new MoveMode (null);
    PencilMode.prototype.onmousedown = function (x,y) {
        this._currentDragPoint = this._editor.insertPointAfter(
            this._editor.getPointIndexUnderMouse ()
        );
    }

    function EraserMode (editor) {
        this._editor = editor;
    }
    EraserMode.prototype.onmousedown = function (x,y) {
        this._editor.deletePointAt (
            this._editor.getPointIndexUnderMouse ()
        );
    }

    function CurveMode (editor) {
        this._editor = editor;
    }
    CurveMode.prototype.onmousedown = function (x,y) {
        var pt = this._editor.getPointUnderMouse ();
        if (pt) pt.c = !pt.c;
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
