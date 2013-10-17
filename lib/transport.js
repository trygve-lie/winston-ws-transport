/* jshint node: true, strict: true */

"use strict";

var util    = require('util'),
    winston = require('winston'),
    socket  = require('./socket.js');



// Transport object

var Transport = exports.WebSocket = function(options) {
  
    var self = this;

    this.name           = 'WebSocket';
    this.level          = options.level         || 'info';

    socket.init({
            levels          : options.levels,
            colors          : options.colors,
            level           : self.level,
            server          : options.server        || null,
            host            : options.host          || null,
            port            : options.port          || 7070,
            path            : options.path          || '/winston-ws',
            authKey         : options.authKey       || '',
            backlogLength   : options.backlogLength || 30,
    });

};



// Inherit from winston transport

util.inherits(Transport, winston.Transport);



// Log a message

Transport.prototype.log = function(level, msg, meta, callback) {

    if (this.silent) {
        return callback(null, true);
    }

    socket.send({
        level   : level,
        msg     : msg,
        meta    : meta
    });

    callback(null, true);
};



// Append the transport to winston

winston.transports.WebSocket = Transport;