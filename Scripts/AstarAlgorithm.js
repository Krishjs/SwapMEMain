/// <reference path="jquery-2.0.3.js" />
/// <reference path="jquery-2.0.3.intellisense.js" />
/// <reference path="BinaryHeap.js" />
/// <reference path="State.js" />
//Puzzler Swap Me
function aStar() {//Para:seqence
    var instance = this;
    this.CurrentState = null;
    this.ranSeq = [];
    this.puzzleModeSqrt = 0;
    this.BlankIndex = 0;
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
    this.goalState = [];
    this.OpenList = null;
    this.seqString = [];
    this.ClosedList = [];
    this.solutionArray = [];
    this.currentState = [];
    this.NextStateList = [];
    this.init = function (seqence) {
        this.puzzleModeSqrt = Math.floor(Math.sqrt(seqence.length));
        this.initializePieceList(this.puzzleModeSqrt)
        this.CurrentState = new State(seqence, null);
        this.ranSeq = seqence;
        this.BlankIndex = seqence.indexOf(0);
        this.goalState = this.getGoalState(seqence);
        this.OpenList = new BinaryHeap(function (state) {
            return state.mcostf;
        });

    }
    this.getGoalState = function (seqence) {
        var goal = [];
        for (var i=1; i < seqence.length; i++) {
            goal.push(i);
        }
        goal.push(0);
        return goal.toString().replace(/\,/g, '');
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
    this.Starter = function (seq) {
        currentState = new State();
        currentState.Init(seq, null, null, null);
        this.OpenList.push(currentState);
        while (this.OpenList.size() > 0) {
              var currentNode = this.OpenList.pop();
            this.ClosedList[currentNode.ranSeqString]=currentNode;
            if (currentNode.ranSeqString === this.goalState) {
                return currentNode;
            }
            this.NextStateList = this.GetNextStateList(currentNode);            
            for (var i = 0; i < this.NextStateList.length; i++) {
                var inOpenList = false;
                var inClosedList = false;
                var nextstate = this.NextStateList[i];
                var IsOpenList = this.IsinOpen(nextstate);
                if (IsOpenList.Present) {
                    inOpenList = true;
                    if (!IsOpenList.Costlier) {
                        instance.OpenList.rescoreElement(nextstate);
                    }
                }
                else {
                    inClosedList = this.ClosedList.hasOwnProperty(nextstate.ranSeqString);
                }
                if (!inClosedList && !inOpenList) {
                    this.OpenList.push(nextstate);
                }
            }
        }
        debugger;
    }
    this.GetNextStateList = function (currentItem) {
        var enableList = this.getDragEnableList(currentItem.blankIndex);
        var nextStatelist = [];
        for (var i = 0; i < enableList.length; i++) {
            var that = jQuery.extend(true, {}, currentItem);
            var ransSeq = instance.Swap(that.rSeq, enableList[i], that.blankIndex);
            var nextState = new State();
            nextState.Init(ransSeq, currentItem, enableList[i], that.blankIndex)
            nextStatelist.push(nextState);
        }
        return nextStatelist;
    }
    this.Swap = function (seq, index, bindex) {
        var seqNew = seq;
        seqNew[bindex] = seqNew[index];
        seqNew[index] = 0;
        return seqNew;
    }
    this.IsinOpen = function (nextstate) {
        var present = false;
        var costlier = false;
        for (var i = 0; i < this.OpenList.content.length; i++) {
            if (this.OpenList.content[i].ranSeqString === nextstate.ranSeqString) {
                present= true;
                costlier= this.OpenList.content[i].mcostf < nextstate.mcostf;
            }           
        }
        return {
            Present: present,
            Costlier: costlier,
        };
    }

    this.IsinClosed = function (nextstate) {
        var present = false;
        var costlier = false;
        for (var i = 0; i < this.ClosedList.length; i++) {
            if (this.ClosedList[i].ranSeqString === nextstate.ranSeqString) {
                present= true;
                costlier: this.ClosedList[i].mcostf < nextstate.mcostf;
            }  
        }
        return {
            Present: present,
            Costlier: costlier,
        };
    }
}