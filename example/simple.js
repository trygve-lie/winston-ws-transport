/* jshint node: true, strict: true */

"use strict";

var winston     = require('winston'),
    winstonWs   = require('../');



// Set up logger with a custom debug level

var log = new (winston.Logger)({
    levels: {
        debug   : 0,
        info    : 1,
        warn    : 2,
        error   : 3
    },
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
            levels              : {
                                    debug   : 0,
                                    info    : 1,
                                    warn    : 2,
                                    error   : 3
                                },
            colors              : {
                                    debug   : 'blue',
                                    info    : 'green',
                                    warn    : 'yellow',
                                    error   : 'red'
                                }
        })
    ]
});

winston.addColors({
    debug   : 'blue',
    info    : 'green',
    warn    : 'yellow',
    error   : 'red'
});




// Schedule some logging
log.info('hello');
setInterval(function(){
    log.info('The time is: ' + new Date());
}, 1000);