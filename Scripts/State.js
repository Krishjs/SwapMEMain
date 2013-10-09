/// <reference path="swapMe.js" />
/// <reference path="State.js" />
/// <reference path="AstarAlgorithm.js" />

function State() {
    var instance = this;
    this.rSeq = null;
    this.blankIndex = 0;
    this.FromDiv = null;
    this.ToDiv = null;
    this.parent = null;
    this.mcostg = 0;
    this.mcostg = 0;
    this.mcosth = 0;
    this.mcostf = 0;
    this.ranSeqString = [];
    this.GetMoveCost = function () {
        var heuristicCost = 0;
        var gridX = Math.floor(Math.sqrt(instance.rSeq.length));
        var idealX = 0
        var idealY = 0;
        var currentX = 0;
        var currentY = 0;
        var value = 0;
        var penalty = 0;
        for (var i = 0; i < instance.rSeq.length; i++) {
            value = this.rSeq[i] - 1;
            penalty=this.rSeq[i]-1==this.rSeq[i+1] ? 1:0; 
            if (value === -1) {
                value = this.rSeq.length - 1;
                this.blankIndex = i;
            }
            if (value != i) {
                idealX = value % gridX;
                idealY = value / gridX;
                currentX = i % gridX;
                currentY = i / gridX;
                heuristicCost += Math.floor(Math.abs(idealY - currentY) + Math.abs(idealX - currentX))+penalty;
            }
        }
        return heuristicCost;
    }
    this.Init = function (seq, parent, fromDiv, toDiv) {
        this.rSeq = seq;
        this.blankIndex = seq.indexOf(0);
        this.FromDiv = fromDiv;
        this.ToDiv = toDiv;
        this.parent = parent;
        if (this.parent == null) {
            this.mcostg = 0;
        }
        else {
            this.mcostg = this.parent.mcostg + 1;
        }
        this.mcosth = this.GetMoveCost();
        this.mcostf = this.mcostg + this.mcosth;
        this.ranSeqString = seq.toString().replace(/\,/g,'');        
    }
}