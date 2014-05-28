"use strict";
 /**
 * socket
 * @author Dennis Sänger, 2013
 */

var config   = require('./config'),
    io       = require('socketio-client');

var mod = {},
    host = config.host.replace(/\\/,'');

var socket = io.connect( host );
socket.on('connected', function() {
  console.log( 'connected to socket.io server', socket );
});

module.exports = mod;