/// <reference path="jquery.signalR-1.1.3.js" />
/// <reference path="gameTimer.js" />
/// <reference path="jquery-2.0.3.min.js" />
/// <reference path="swapMe.js" />
(function () {
    // Declare a proxy to reference the hub. 
    var chatHub = $.connection.chatHub;
    registerClientMethods(chatHub);
    // Start Hub
    $.connection.hub.start().done(function () {
        registerEvents(chatHub)
    });

})();