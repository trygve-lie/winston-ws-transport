/* jshint node: true, strict: true */

"use strict";

var WebSocketServer = require('ws').Server,
    url             = require('url'),

    backlog         = [],
    backlogLength   = 20,
    wss;



// Broadcast single message to multiple clients

function broadcast(socket, msg) {
    var i = socket.clients.length;
    while(i--){
        socket.clients[i].send(msg);
    }
}



// Authenticate remote user

function authenticate(key, info, callback) {
    var uriObj = url.parse(info.req.url, true);
    if (uriObj.query.key === key) {
        callback.call(null, true);
    } else {
        callback.call(null, false);
    }
}



// Init a WebSocket server

module.exports.init = function(options){

    // Config object for the websocket

    var config = {
        disableHixie    : true,
        path            : options.path
    }

    // Enable auth

    if (options.authKey) {
        config.verifyClient = function(info, callback){
            authenticate.call(null, options.authKey, info, callback);
        };
    }

    // Overide defautl backlog length

    if (options.backlogLength) {
        backlogLength = options.backlogLength;
    }

    // Switch between provinding the WebSocket server a http server or not

    if (options.server) {
        config.server = options.server;
    } else {
        config.port = options.port;
        config.host = options.host;
    }

    // Set up WebSocket server

    wss = new WebSocketServer(config);

    wss.on('connection', function(ws) {
        var obj = {
            type : 'winston:init',
            data : {
                colors  : options.colors,
                levels  : options.levels,
                level   : options.level,
                backlog : backlog
            }
        };
        ws.send(JSON.stringify(obj));
    });

};



// Send a message to all connected clients

module.exports.send = function(msg){
    var obj = {
        type : 'winston:log',
        data : msg
    };
    
    backlog.push(msg);

    if (backlog.length > backlogLength) {
        backlog.splice(0, (backlog.length - backlogLength));
    }

    broadcast(wss, JSON.stringify(obj));
};