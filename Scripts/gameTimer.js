//Timer
/// <reference path="/Scripts/jquery-1.7.2.min.js"/>
function gameTimer(parent) {
    var instance = this;
    this.TimerParent = parent;
    this.$counterSec = null;
    this.$counterSecTen = null;
    this.$counterMin = null;
    this.$counterMinTen = null;
    this.$counterHrs = null;
    this.isTimerStarted = false;
    this.iDivElement = [];
    this.seconds = {
        Flipper: 0,
        Count: 0,
        CssbgXposition: null,
        counterElementId: 'counterSec',
        counterElement: '$counterSec',
        parentElement: 'secondsTen',
        childElement: '',
        isTens: false,
    };
    this.secondsTen = {
        Flipper: 0,
        Count: 0,
        CssbgXposition: null,
        counterElementId: 'counterSecTen',
        counterElement: '$counterSecTen',
        parentElement: 'minutes',
        childElement: 'seconds',
        isTens: false,
    };
    this.minutes = {
        Flipper: 0,
        Count: 0,
        CssbgXposition: null,
        counterElementId: 'counterMin',
        counterElement: '$counterMin',
        parentElement: 'minutesTen',
        childElement: 'secondsTen',
        isTens: true,
    };
    this.minutesTen = {
        Flipper: 0,
        Count: 0,
        CssbgXposition: null,
        counterElementId: 'counterMinTen',
        counterElement: '$counterMinTen',
        parentElement: 'hours',
        childElement: 'minutes',
        isTens: false,
    };
    this.hours = {
        Flipper: 0,
        Count: 0,
        CssbgXposition: null,
        counterElementId: 'counterHrs',
        counterElement: '$counterHrs',
        parentElement: 'hoursTen',
        childElement: 'minutesTen',
    };
    this.hoursTen = {
        Flipper: 0,
        Count: 0,
        CssbgXposition: null,
        counterElementId: 'counterHrsTen',
        counterElement: '$counterHrsTen',
        parentElement: 'Days',
    };
    this.days = {
        Flipper: 0,
        Count: 0,
        CssbgXposition: null,
        counterElement: '$counterDays',
        parentElement: 'DaysTen',
    };
    this.daysTen = {
        Flipper: 0,
        Count: 0,
        CssbgXposition: null,
        counterElement: '$counterDaysTen',
    };
    this.TimerId = null;
    this.totalSeconds = 0;
    this.totalMinutes = 0;
    this.startTime = 0;
    this.currentTime = 0;
    this.endTime = 0;
    this.TimerFn = null;
    this.Stop = null;
    this.iDiv = [];
    this.isLoaded = false;
    this.constants = {
        seconds: {
            FlipperRange: 9,
        },
        secondsTen: {
            FlipperRange: 5,
        },
        minutes: {
            FlipperRange: 9,
        },
        minutesTen: {
            FlipperRange: 5,
        },
        hours: {
            FlipperRange: 9,
        },
        hoursTen: {
            FlipperRange: 5,
        },
        days: {
            FlipperRange: 9,
        },
        daysTen: {
            FlipperRange: 100,
        },
        cssXposition: 54,
    };
    this.Start = function () {
        var instanceStart = this;
        if (!this.isLoaded) {
            this.$counterSec = $('#counterSec' + this.TimerParent);
            this.$counterSecTen = $('#counterSecTen' + this.TimerParent);
            this.$counterMin = $('#counterMin' + this.TimerParent);
            this.$counterMinTen = $('#counterMinTen' + this.TimerParent);
            this.$counterHrs = $('#counterHrs' + this.TimerParent);
            this.$counterHrsTen = $('#counterHrsTen' + this.TimerParent);
            this.isLoaded = true;
        }
        this.isTimerStarted = true;
        this.TimerId = setInterval(function () {
            instanceStart.Clocktimer("seconds")
        }, 1000);
    }
    this.Stop = function () {
        clearInterval(this.TimerId);
    }
    this.Reset = function () {
        this.Stop();
        if (this.isTimerStarted) {
            var element = 'seconds';
            for (var i = 0; i < 4; i++) {
                this[this[element].counterElement].css('background-position-x', '0px');
                this[element].Flipper = 0;
                element = this[element].parentElement;
                this[element].Count = 0;
            }
        }
    }
    this.Clocktimer = function (child) {
        var element = this[this[child].counterElement];
        this[child].Count++;
        if ((this[child].Flipper != this.constants[child].FlipperRange)) {
            this[child].Flipper++;
            element.css('background-position-x', this.getNextCss(child));
        }
        else {
            this[child].Flipper = 0;
            element.css('background-position-x', '0px');
            this.Clocktimer(this.getParent(child));
        }
    }
    this.DaysCounter = function () {

    }
    this.getParent = function (child) {
        return this[child].parentElement;
    }
    this.getNextCss = function (child) {
        this.updateCss(child);
        return ((parseInt(this[child].CssbgXposition.replace('px', '')) - this.constants.cssXposition) + 'px');
    }
    this.updateCss = function (child) {
        this[child].CssbgXposition = this[this[child].counterElement].css('background-position-x') || this[this[child].counterElement][0].style.backgroundPositionX;
    }
    this.getTotalSeconds = function () {
        return this['seconds'].Count;
    }
    this.DivAppender = function (iDiv, iImg) {
        var el = document.getElementById("timer" + this.TimerParent);
        for (i < 0; i < 6; i++) {
            if (i % 2 !== 0) {
                el.appendChild(iDiv[i]);
            }
        }
    }
    this.DivBuilder = function (child) {
        var el = document.getElementById("timer" + this.TimerParent);
        el.appendChild(this.CreateDiv(this[child].counterElementId + this.TimerParent));
        if (this[child].isTens) {
            el.appendChild(this.CreateImgDiv())
        }
        if (this[child].childElement != '') {
            this.DivBuilder(this[child].childElement);
        }
    }
    this.CreateDiv = function (Id) {
        var Div = document.createElement('div');
        Div.id = Id;
        Div.className = 'divInn';
        Div.style.height = 93 + 'px';
        Div.style.width = 54 + 'px';
        Div.style.border = 'solid';
        Div.style.cssFloat = 'left';
        Div.style.background = "url('SwapME/Content/images/counter.jpg') no-repeat";
        Div.style.backgroundPosition = "-0px -0px";
        return Div;
    }
    this.CreateImgDiv = function () {
        var Div = document.createElement('div');
        Div.className = 'divInn';
        Div.style.height = 93 + 'px';
        Div.style.width = 27 + 'px';
        Div.style.border = 'solid';
        Div.style.cssFloat = 'left';
        Div.appendChild(this.createSubImg());
        Div.appendChild(this.createSubImg());
        return Div;
    }
    this.createSubImg = function () {
        var img = document.createElement('img');
        img.style.height = 40 + '%';
        img.style.width = 100 + '%';
        img.style.position = 'relative';
        img.style.top = '10%';
        img.src = "SwapME/Content/images/dot.jpg";
        return img;
    }  
}