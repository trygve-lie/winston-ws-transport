/* jshint node: true, strict: true */

"use strict";

var http        = require('http'),
    winston     = require('winston'),
    express     = require('express'),
    winstonWs   = require('../'),
    app         = express();



app.get('/', function(req, res){
    res.json({hello:'world'});
});

var httpServer = http.createServer(app);
httpServer.listen(7070);




// Set up logger with a custom debug level

var levels = {
    debug   : 0,
    info    : 1,
    warn    : 2,
    error   : 3
};

var colors = {
    debug   : 'blue',
    info    : 'green',
    warn    : 'yellow',
    error   : 'red'
};

var log = new winston.Logger({
    levels      : levels,
    colors      : colors,
    exitOnError : false,
    transports  : [
        new winston.transports.Console({
            silent              : false,
            level               : 'debug',
            colorize            : true,
            handleExceptions    : true
        }),
        new winstonWs.WebSocket({
            silent              : false,
            level               : 'debug',
            colorize            : true,
            handleExceptions    : true,
            authKey             : 'changeme',
            server              : httpServer,
            levels              : levels,
            colors              : colors
        })
    ]
});



// Schedule some logging

log.info('Start logging');
setInterval(function(){
    log.debug('The time is: ' + new Date());
}, 1000);