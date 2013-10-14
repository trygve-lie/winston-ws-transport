/* jshint node: true, strict: true */

"use strict";

var WebSocketServer = require('ws').Server,

    backlog         = [],
    backlogLength   = 20,
    wss;



// Broadcast single message to multiple clients

function broadcast(msg) {
    var i = this.clients.length;
    while(i--){
        this.clients[i].send(msg);
    }
};



// Init a WebSocket server

module.exports.init = function(options){

    var wssConfig = {
        disableHixie    : true,
        server          : options.server    || null,
        port            : options.port      || 7070,
        host            : options.host      || null,
        path            : options.path      || null
    };

    if (options.backlogLength) {
        backlogLength = options.backlogLength;
    }

    wss = new WebSocketServer(wssConfig);

    wss.on('connection', function(ws) {
        var obj = {
            type : 'init',
            data : {
                colors  : options.colors,
                levels  : options.levels,
                level   : options.level,
                backlog : backlog
            }
        }
        ws.send(JSON.stringify(obj));
    });

    wss.broadcast = broadcast;
};



// Send a message to all connected clients

module.exports.send = function(msg){
    var obj = {
        type : 'log',
        data : msg
    };
    
    backlog.push(msg);

    if (backlog.length > backlogLength) {
        backlog.splice(0, (backlog.length - backlogLength));
    };

    wss.broadcast(JSON.stringify(obj));
};