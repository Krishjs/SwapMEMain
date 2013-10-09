/// <reference path="AstarAlgorithm.js" />
//Puzzler Swap Me
/// <reference path="/Scripts/jquery-1.7.2.min.js"/>
/// <reference path="gameTimer.js" />

function swapMe(parent) {
    var instance = this;
    this.puzzleMode = null;
    this.puzzleModeSqrt = 0;
    this.currentPuzzleState = null;
    this.parentDiv = parent;
    this.missingPiece = null;
    this.DraggableState = false;
    this.CurrentFromDiv = null;
    this.CurrentIMGId = null;
    this.currentToDiv = null;
    this.BlankDivId = null;
    this.BlankDivIndex = 0;
    this.prevDivId = null;
    this.nextDivId = null;
    this.ImgTagArray = [];
    this.DivTagArray = [];
    this.isFirstDrop = false;
    this.totalMoves = 0;
    this.isPreview = false;
    this.SolvingMove = new State();
    this.Solver = new aStar();
    this.Movelist = [];
    this.MoveReverselist = [];
    this.movesToSolve = 0;
    this.Moves = {
        FromDiv: null,
        ToDiv: null,
    };
    this.SolverTimer = null;
    this.SolverIndex = 0;
    this.ImageRegex = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
    this.KeyControls = {
        Up: 0,
        Down: 0,
        Left: 0,
        Right: 0,
    };
    this.constants = {
        EightMode: 9,
        FifteenMode: 16,
        Postion: 33.3,
        cssXposition: -200,
        cssYposition: -200,
    };
    this.fileChangedFlag = false;
    this.fileChangedIndex = 0;
    this.getBgYpositionFlag = false;
    this.Timer = new gameTimer(parent);
    this.CurrentBgImageUrl = "url('Content/Images/_DSF4195.jpg') no-repeat";
    this.lastCssBgPostionX = 200;
    this.lastCssBgPostionY = 0;
    this.MaxCssBgPostion = 600;
    this.CssPostionLevelX = 0;
    this.CssPostionLevelY = 0;
    this.leftCornerList = [];
    this.edgeListRow = [];
    this.edgeListColumn = [];
    this.edgeListTopRow = [];
    this.edgeListBottomRow = [];
    this.edgeListRightColumn = [];
    this.edgeListLeftColumn = [];
    this.rightCornerList = [];
    this.middleList = [];
    this.currentEnableList = [];
    this.changeDragStateAfterCreate = null;
    this.changeDragStateAfterCreate = null;
    this.resetKeyPressEvents = null;
    this.InitializecssPosition = function () {
        $('#timetaken' + this.parentDiv).text('');
        $('#status' + this.parentDiv).text('Active');
        $('#count' + this.parentDiv).text(0);
        this.isFirstDrop = false;
        this.lastCssBgPostionX = 200;
        this.lastCssBgPostionY = 0;
        this.MaxCssBgPostion = 600;
        this.CssPostionLevelX = 0;
        this.CssPostionLevelY = 0;
    }
    this.isPreview = false;
    this.buttonHolderId = 'buttonHolder' + this.parentDiv;
    this.previewHolderId = 'previewHolder' + this.parentDiv;
    if (window.FileReader) {
        this.fileReader = new FileReader();
    }
    this.currentImgUrl = [];
    this.Newpuzzle = function (mode) {
        this.puzzleMode = mode;
        this.Timer.DivBuilder('minutesTen');
        if (window.FileReader) {
            this.buttonHolderBuilder();
        }
        this.puzzleModeSqrt = Math.floor(Math.sqrt(mode));
        this.initializePieceList(this.puzzleModeSqrt);
        this.puzzleCreator(mode, this.getRandom(mode), this.DivTagBuiler(mode), this.ImgTagBuilder(mode));
        this.KeyControlBindevent();
    }
    this.KeyControlBindevent = function () {
        $(document).keydown(function (e) {
            $.each(instance.KeyControls, function (i, el) {
                if (e.keyCode === el && !instance.isPreview)
                    instance.KeyPressEvents(e);
            });
            return true;
        });
        $('#Reset' + this.parentDiv).click(function (e) {
            instance.resetKeyPressEvents(e, this);
        });
        $('#Shuffle' + this.parentDiv).click(function (e) {
            instance.ShuffleKeyPressEvents(e, this);
        });
    }
    this.resetKeyPressEvents = function (event, target) {
        this.Timer.Reset();
        this.isPreview = true;
        instance.killSolver();
        instance.createPreview(this.puzzleMode, this.DivTagBuiler(this.puzzleMode), this.ImgTagBuilder(this.puzzleMode));
    }
    this.ShuffleKeyPressEvents = function (event, target) {
        this.Timer.Reset();
        this.isPreview = false;
        instance.killSolver();
        document.getElementById(this.parentDiv).innerHTML = '';
        if (event) {
            this.CurrentBgImageUrl = "url('~/Content/Images/_DSF4195.jpg') no-repeat";
        }
        this.InitializecssPosition();
        this.puzzleCreator(this.puzzleMode, this.getRandom(instance.puzzleMode), this.DivTagBuiler(this.puzzleMode), this.ImgTagBuilder(this.puzzleMode));
    }
    this.createPreview = function (mode, iDiv, iImg) {
        document.getElementById(this.parentDiv).innerHTML = '';
        for (var i = 0; i < mode; i++) {
            iDiv[i].style.cursor = 'default';
            iImg[i].draggable = 'false';
            this.isPreview = true;
            iDiv[i].appendChild(iImg[i]);
            document.getElementById(this.parentDiv).appendChild(iDiv[i]);
        }
        this.InitializecssPosition();
    }

    this.BindControls = function (up, down, left, right) {
        this.KeyControls.Up = up;
        this.KeyControls.Down = down;
        this.KeyControls.Left = left;
        this.KeyControls.Right = right;
    }
    this.getRandom = function (puzzleMode) {
        var randomSeq = new Array();
        for (var i = 0; i < puzzleMode; i++) {
            var randomNumber = Math.floor(Math.random() * (puzzleMode - 0) + 0);
            if ($.inArray(randomNumber, randomSeq) === -1) {
                randomSeq.push(randomNumber)
            }
            else i--;
        }
        if (this.checkSolveablity(randomSeq, puzzleMode)) {
            return randomSeq;
        }
        else {
            return this.getRandom(puzzleMode);
        }
    }
    this.checkSolveablity = function (shuffle, mode) {
        var inversion = new Number();
        shuffle.forEach(function (vm, im, om) {
            om.slice(im, om.length).forEach(function (v, i, o) {
                if (vm > v && v !== 0)
                    inversion++;
            });
        });
        return (inversion % 2 == 0);
    }
    this.puzzleCreator = function (mode, sequence, iDiv, iImg) {
        this.Solver.init(sequence);
        this.SolvingMove = this.Solver.Starter(sequence);
        this.SolverList(this.SolvingMove, 0);
        $.each(sequence, function (i, v) { if (v == 0) instance.BlankDivIndex = i; });
        var DivReturner = this.changeDragState(this.getDragEnableList(this.BlankDivIndex), sequence, iDiv, iImg);
        this.InitializecssPosition();
        for (var i = 0; i < 9; i++) {
            if (sequence[i] !== 0) {
                DivReturner.iDiv[i].appendChild(DivReturner.iImg[sequence[i] - 1]);
            }
            else {
                this.missingPiece = DivReturner.iImg[(mode * mode) - 1];
                this.BlankDivId = instance.parentDiv + 'D' + i;
                this.BlankDivIndex = i;
            }
            document.getElementById(this.parentDiv).appendChild(DivReturner.iDiv[i]);
        }
    }
    this.changeDragState = function (list, seq, iDivR, iImgR) {
        $.each(list, function (i, v) {
            iDivR[v].style.cursor = 'default';
            iImgR[seq[v] - 1].draggable = true;
        });
        iDivR[this.BlankDivIndex].style.cursor = 'default';
        iDivR[this.BlankDivIndex].ondrop = function (event) { instance.DropManager(event, this) };
        iDivR[this.BlankDivIndex].ondragover = function (event) { instance.DragOverManager(event, this) };
        return {
            iDiv: iDivR,
            iImg: iImgR
        };
    }
    this.getDragEnableList = function (imgindex) {
        var EnableList = [];
        if (this.IsLeftCorner(imgindex)) {
            var cornerEl = imgindex == 0 ? this.puzzleModeSqrt : -this.puzzleModeSqrt;
            EnableList.push(imgindex + 1, imgindex + cornerEl);
        }
        else if (this.IsRightCorner(imgindex)) {
            var cornerEl = imgindex == this.puzzleModeSqrt - 1 ? this.puzzleModeSqrt : -this.puzzleModeSqrt;
            EnableList.push(imgindex - 1, imgindex + cornerEl);
        }
        else if (this.IsEdgeRow(imgindex)) {
            var topBottomEl = imgindex - this.puzzleModeSqrt < 0 ? this.puzzleModeSqrt : -this.puzzleModeSqrt;
            EnableList.push(imgindex + 1, imgindex - 1, imgindex + topBottomEl);
        }
        else if (this.IsEdgeColumn(imgindex)) {
            var topBottomEl = imgindex % this.puzzleModeSqrt === 0 ? 1 : -1;
            EnableList.push(imgindex + topBottomEl, imgindex - this.puzzleModeSqrt, imgindex + this.puzzleModeSqrt);
        }
        else if (this.IsMiddle(imgindex)) {
            EnableList.push(imgindex - 1, imgindex + 1, imgindex - this.puzzleModeSqrt, imgindex + this.puzzleModeSqrt);
        }
        this.currentEnableList = EnableList;
        return EnableList;
    }
    this.IsLeftCorner = function (indeximg) {
        return (this.leftCornerList.indexOf(indeximg) !== -1);
    }
    this.IsRightCorner = function (indeximg) {
        return (this.rightCornerList.indexOf(indeximg) !== -1);
    }
    this.IsEdgeRow = function (indeximg) {
        return (this.edgeListRow.indexOf(indeximg) !== -1);
    }
    this.IsEdgeColumn = function (indeximg) {
        return (this.edgeListColumn.indexOf(indeximg) !== -1);
    }
    this.IsMiddle = function (indeximg) {
        return (this.middleList.indexOf(indeximg) !== -1);
    }
    this.IsEdgeTopRow = function (indeximg) {
        return (this.edgeListTopRow.indexOf(indeximg) !== -1);
    }
    this.IsEdgeBottomRow = function (indeximg) {
        return (this.edgeListBottomRow.indexOf(indeximg) !== -1);
    }
    this.IsEdgeRightColumn = function (indeximg) {
        return (this.edgeListRightColumn.indexOf(indeximg) !== -1);
    }
    this.IsEdgeLeftColumn = function (indeximg) {
        return (this.edgeListLeftColumn.indexOf(indeximg) !== -1);
    }
    this.initializePieceList = function (mode) {
        var index = 0;
        for (var i = 1; i <= mode; i++) {
            for (var j = 1; j <= mode; j++) {
                if (j == 1 && (i == 1 || i == mode))
                    this.leftCornerList.push(index);
                if (j == mode && (i == 1 || i == mode))
                    this.rightCornerList.push(index);
                if (((i == 1) && (j > 1 && j < mode)))
                    this.edgeListTopRow.push(index);
                if (((i == mode) && (j > 1 && j < mode)))
                    this.edgeListBottomRow.push(index);
                if (((j == mode) && (i > 1 && i < mode)))
                    this.edgeListRightColumn.push(index);
                if (((j == 1) && (i > 1 && i < mode)))
                    this.edgeListLeftColumn.push(index);
                if ((i > 1 && i < mode) && (j > 1 && j < mode))
                    this.middleList.push(index);
                index++;
            }
        }
        this.edgeListRow = instance.edgeListTopRow.concat(instance.edgeListBottomRow);
        this.edgeListColumn = instance.edgeListLeftColumn.concat(instance.edgeListRightColumn);
    };
    this.DivTagBuiler = function (mode) {
        for (var i = 0; i < mode; i++) {
            this.DivTagArray[i] = this.CreateDiv(this.parentDiv + 'D' + i);
        }
        return this.DivTagArray;
    }
    this.ImgTagBuilder = function (mode) {
        for (var i = 0; i < mode; i++) {
            this.ImgTagArray[i] = this.CreateImg(this.parentDiv + 'I' + i);
        }
        return this.ImgTagArray;
    }
    this.CreateDiv = function (Id) {
        var Div = document.createElement('div');
        Div.id = Id;
        Div.className = 'divInn';
        Div.style.height = 200;
        Div.style.width = 200;
        Div.style.border = 'solid';
        Div.style.cssFloat = 'left';
        Div.style.cursor = 'no-drop';
        return Div;
    }
    this.CreateImg = function (Id, seq) {
        var img = document.createElement('img');
        img.id = Id;
        img.height = 200;
        img.width = 200;
        if (!seq) {
            img.ondragstart = function (event) { instance.DragStartManager(event, this) };
            img.draggable = false;
            var postion = this.getBgposition();
            img.style.background = this.CurrentBgImageUrl;
            img.style.backgroundPosition = postion.PostionX + 'px ' + postion.PostionY + 'px';
            this.lastCssBgPostionX = postion.PostionX;
            this.lastCssBgPostionY = postion.PostionY;
            img.src = "~/Content/images/blank.gif";
        }
        return img;
    }
    this.getBgposition = function () {
        var instanceCssPositionX = this.CssPostionLevelX;
        var instanceCssPositionY = this.CssPostionLevelY;
        this.CssPostionLevelX = (this.CssPostionLevelX) < (Math.sqrt(this.puzzleMode) - 1) ? this.CssPostionLevelX + 1 : 0;
        this.CssPostionLevelY = ((this.CssPostionLevelY < (Math.sqrt(this.puzzleMode) - 1))
            && instanceCssPositionX === (Math.sqrt(this.puzzleMode) - 1)) ? this.CssPostionLevelY + 1 : instanceCssPositionY;
        return {
            PostionX: (instanceCssPositionX * this.constants.cssXposition),
            PostionY: (instanceCssPositionY * this.constants.cssYposition),
        };
    }
    this.DragStartManager = function (event, target) {
        event.dataTransfer.setData("Text", target.id);
        this.CurrentIMGId = target.id;
        this.CurrentFromDiv = $('#' + this.CurrentIMGId).parent();
        return true;
    }
    this.DropManager = function (event, target) {
        event.preventDefault();
        if (this.CurrentFromDiv != event.target.id && target.hasChildNodes())
            document.getElementById(event.target.id).appendChild(document.getElementById(this.CurrentIMGId));
        this.BlankDivIndex = parseInt((this.CurrentFromDiv[0].id).replace(this.parentDiv + 'D', ''));
        this.changeDragStateAfterCreate();
        this.CheckGoalState();
        return false;
    }

    this.DragOverManager = function (event, target) {
        event.preventDefault();
        return false;
    }
    this.changeDragStateAfterCreate = function () {
        $.each(instance.currentEnableList, function (i, v) {
            if (v != instance.BlankDivIndex) {
                var el = document.getElementById(instance.parentDiv + 'D' + v);
                el.style.cursor = 'no-drop';
                var els = $('#' + instance.parentDiv + 'D' + v).children('img');
                document.getElementById(els[0].id).draggable = false;
            }
        });
        $.each(instance.getDragEnableList(instance.BlankDivIndex), function (i, v) {
            if (v != instance.BlankDivIndex) {
                var el = document.getElementById(instance.parentDiv + 'D' + v);
                el.style.cursor = 'default';
                if (el.hasChildNodes()) {
                    var els = $('#' + instance.parentDiv + 'D' + v).children('img');
                    document.getElementById(els[0].id).draggable = true;
                }
            }
        });
        var el = document.getElementById(instance.parentDiv + 'D' + this.BlankDivIndex);
        el.style.cursor = 'default';
        el.ondrop = function (event) { instance.DropManager(event, this) };
        el.ondragover = function (event) { instance.DragOverManager(event, this) };
    }
    // 37 - left  38 - up 39 - right 40 - down
    this.KeyPressEvents = function (e) {
        e.preventDefault();
        if (e.keyCode == this.KeyControls.Left && !instance.IsRightCorner(instance.BlankDivIndex) && !instance.IsEdgeRightColumn(instance.BlankDivIndex)) {
            var els = $('#' + instance.parentDiv + 'D' + (instance.BlankDivIndex + 1)).children('img');
            document.getElementById(instance.parentDiv + 'D' + instance.BlankDivIndex).appendChild(document.getElementById(els[0].id));
            instance.BlankDivIndex += 1
            instance.BlankDivId = instance.parentDiv + 'D' + instance.BlankDivIndex;
            this.CheckGoalState();
            return true;
        }
        if (e.keyCode == this.KeyControls.Right && !instance.IsLeftCorner(instance.BlankDivIndex) && !instance.IsEdgeLeftColumn(instance.BlankDivIndex)) {
            var els = $('#' + instance.parentDiv + 'D' + (instance.BlankDivIndex - 1)).children('img');
            document.getElementById(instance.parentDiv + 'D' + instance.BlankDivIndex).appendChild(document.getElementById(els[0].id));
            instance.BlankDivIndex -= 1
            instance.BlankDivId = instance.parentDiv + 'D' + instance.BlankDivIndex;
            this.CheckGoalState();
            return true;
        }
        if (e.keyCode == this.KeyControls.Down && instance.BlankDivIndex >= instance.puzzleModeSqrt) {
            var els = $('#' + instance.parentDiv + 'D' + (instance.BlankDivIndex - instance.puzzleModeSqrt)).children('img');
            document.getElementById(instance.parentDiv + 'D' + instance.BlankDivIndex).appendChild(document.getElementById(els[0].id));
            instance.BlankDivIndex -= instance.puzzleModeSqrt
            instance.BlankDivId = instance.parentDiv + 'D' + instance.BlankDivIndex;
            this.CheckGoalState();
            return true;
        }
        if (e.keyCode == this.KeyControls.Up && instance.BlankDivIndex < (instance.puzzleMode - instance.puzzleModeSqrt)) {
            var els = $('#' + instance.parentDiv + 'D' + (instance.BlankDivIndex + instance.puzzleModeSqrt)).children('img');
            document.getElementById(instance.parentDiv + 'D' + instance.BlankDivIndex).appendChild(document.getElementById(els[0].id));
            instance.BlankDivIndex += instance.puzzleModeSqrt
            instance.BlankDivId = instance.parentDiv + 'D' + instance.BlankDivIndex;
            this.CheckGoalState();
            return true;
        }
        return true;
    }
    this.CheckGoalState = function () {
        var flag = true;
        this.totalMoves++;
        $('#count' + this.parentDiv).text(this.totalMoves);
        if (!instance.isFirstDrop) {
            instance.Timer.Start();
            instance.isFirstDrop = true;
        }
        if (this.BlankDivIndex === (this.puzzleMode - 1)) {
            $('#' + this.parentDiv).find('div').each(function (i, el) {
                var parent = el.id.replace(instance.parentDiv + "D", "");
                var child = "";
                if (el.hasChildNodes())
                    child = el.firstChild.id.replace(instance.parentDiv + "I", "");
                if (parent != child && el.hasChildNodes()) {
                    flag = false;
                }
            });
        }
        else {
            flag = false;
        }
        if (flag) {
            this.Timer.Stop();
            $('#timetaken' + this.parentDiv).text(this.Timer.getTotalSeconds() + ' Seconds');
            $('#status' + this.parentDiv).text('Won');
            this.totalMoves = 0;
            this.isFirstDrop = false;
        }
    }
    this.ImageResizer = function (url, width, height, callback) {
        var sourceImage = new Image();
        sourceImage.onload = function () {
            debugger;
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            canvas.style.width = '600px';
            canvas.style.height = '600px';
            canvas.getContext("2d").drawImage(sourceImage, 0, 0, width, height);
            callback(canvas.toDataURL());
        }
        sourceImage.src = url;
    }
    this.buttonHolderBuilder = function () {
        var uploadButton = document.createElement('input')
        uploadButton.id = 'filereader' + this.parentDiv;
        uploadButton.type = 'file';
        uploadButton.multiple = true;
        uploadButton.style.position = 'relative';
        uploadButton.style.top = 65 + '%';
        uploadButton.onchange = function (event) { instance.ImageFileReader(event, this); }
        document.getElementById(this.buttonHolderId).appendChild(uploadButton);
    }
    this.ImageFileReader = function (event, target) {
        var filetypeflag = false;
        if (target.files.length == 0 || this.fileChangedIndex >= 5) { return; }
        else {
            this.FilesList = target.files;
            var limit = target.files.length <= 6 ? target.files.length : 6;
            for (var i = 0; i < limit; i++) {
                if (this.ImageRegex.test(target.files[i].type)) {
                    if (!instance.fileChangedFlag) {
                        instance.ImageResizer(window.URL.createObjectURL(target.files[i]), 600, 600, instance.imageChanger);
                        instance.fileChangedFlag = true;
                    }
                    else {
                        var iImg = instance.CreateImg('previewImage' + instance.parentDiv + instance.fileChangedIndex, false);
                        iImg.style.cssFloat = 'left';
                        iImg.src = window.URL.createObjectURL(target.files[i]);
                        iImg.onclick = function (event) {
                            instance.imageChanger(instance.imageChangerFromHolder(this.id));
                        };
                        var iDiv = this.CreateDiv('previewDiv' + instance.parentDiv + instance.fileChangedIndex);
                        iDiv.style.cursor = 'default';
                        iDiv.appendChild(iImg);
                        document.getElementById(this.previewHolderId).appendChild(iDiv);
                        this.fileChangedIndex++;
                    }
                }
            }
            instance.fileChangedFlag = false;
        }
    }
    this.imageChangerFromHolder = function (Id) {
        var sourceImage = new Image();
        var canvas = document.createElement("canvas");
        sourceImage.onload = function () {
            canvas.height = 600;
            canvas.width = 600;
            canvas.getContext("2d").drawImage(sourceImage, 0, 0, 600, 600);
        }
        sourceImage.src = document.getElementById(Id).src;
        $(sourceImage).trigger('load');
        return canvas.toDataURL()
    }
    this.imageChanger = function (imageurl) {
        instance.CurrentBgImageUrl = 'url(' + imageurl + ') no-repeat';
        instance.ShuffleKeyPressEvents();
    }

    this.SolverList = function (node, index) {
        this.MoveReverselist.push({ FromDiv: node.FromDiv, ToDiv: node.ToDiv });
        if (node.parent != null){
            this.SolverList(node.parent, index++);
        }
        else {
            this.MoveReverse(this.MoveReverselist);
        }
    }
    this.MoveReverse = function (obj) {
        for (var i = 0; i < obj.length-1; i++) {
            this.Movelist[i] = obj[(obj.length-2) - i];
        }
        this.movesToSolve=this.Movelist.length;
    }
    this.SolvethePuzzle = function () {
       instance.SolverTimer =setInterval(function () {
             if (instance.SolverIndex !== instance.Movelist.length) {
                 var element = document.getElementById(instance.parentDiv+'D' + instance.Movelist[instance.SolverIndex].FromDiv).firstChild;
                 document.getElementById(instance.parentDiv + 'D' + instance.Movelist[instance.SolverIndex].ToDiv).appendChild(element);
                 instance.SolverIndex++;
                 $('#count' + instance.parentDiv).text(instance.SolverIndex);
             }
             else {
                 clearInterval(instance.SolverTimer);
                 instance.killSolver();
             }
        },250)
    }
    this.killSolver = function () {
        this.SolvingMove = new State();
        this.Solver = new aStar();
        this.Movelist = [];
        this.MoveReverselist = [];
        this.Moves = {
            FromDiv: null,
            ToDiv: null,
        };
        this.SolverTimer = null;
        this.SolverIndex = 0;
    }
}