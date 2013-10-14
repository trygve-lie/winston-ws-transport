/* jshint node: true, strict: true */

"use strict";

var util    = require('util'),
    winston = require('winston'),
    socket  = require('./socket.js');



var Transport = exports.WebSocket = function(options) {
  
    var self = this;

    this.name           = 'WebSocket';
    this.level          = options.level || 'info';
    this.backlogLenght  = options.backlogLength || 20;

    socket.init({
            levels          : options.levels,
            colors          : options.colors,
            level           : self.level,
            backlogLength   : self.backlogLenght,
    });

};



util.inherits(Transport, winston.Transport);



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



winston.transports.WebSocket = Transport;