/* jshint node: true, strict: true */

"use strict";

var util    = require('util'),
    winston = require('winston'),
    socket  = require('./socket.js');



var Transport = exports.WebSocket = function(options) {
  
    var self = this;

    this.name           = 'WebSocket';
    this.level          = options.level         || 'info';
    this.server         = options.server        || null;
    this.host           = options.host          || null;
    this.port           = options.port          || 7070;
    this.authKey        = options.authKey       || '';
    this.backlogLenght  = options.backlogLength || 30;

    socket.init({
            levels          : options.levels,
            colors          : options.colors,
            level           : self.level,
            server          : self.server,
            host            : self.host,
            port            : self.port,
            authKey         : self.authKey,
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