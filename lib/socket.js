/* jshint node: true, strict: true */

"use strict";

var WebSocketServer = require('ws').Server,
    url             = require('url'),

    backlog         = [],
    backlogLength   = 20,
    authKey         = '',
    wss;



// Broadcast single message to multiple clients

function broadcast(msg) {
    var i = this.clients.length;
    while(i--){
        this.clients[i].send(msg);
    }
};



function authenticate(info, callback) {
    var uriObj = url.parse(info.req.url, true);
    if (uriObj.query.key === authKey) {
        callback.call(null, true);
    } else {
        callback.call(null, false);
    }
};



// Init a WebSocket server

module.exports.init = function(options){

    options['disableHixie'] = true;
    
    if (options.authKey) {
        authKey = options.authKey;
        options['verifyClient'] = authenticate;
    }

    if (options.backlogLength) {
        backlogLength = options.backlogLength;
    }

    wss = new WebSocketServer(options);

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