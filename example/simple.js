/* jshint node: true, strict: true */

"use strict";

var winston     = require('winston'),
    winstonWs   = require('../');



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

var log = new (winston.Logger)({
    levels      : levels,
    colors      : colors,
    exitOnError : false,
    transports  : [
        new (winston.transports.Console)({
            silent              : false,
            level               : 'debug',
            colorize            : true,
            handleExceptions    : true
        }),
        new (winstonWs.WebSocket)({
            silent              : false,
            level               : 'debug',
            colorize            : true,
            handleExceptions    : true,
            authKey             : 'changeme',
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