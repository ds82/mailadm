"use strict";
 /**
 * socket
 * @author Dennis Sänger, 2013
 */
define([
	'config',
	'socketio-client'
], function( config, io ) {
 
	console.log( 'io', io );

	var Module = {},
		host = config.host.replace(/\\/,'');
	
	var socket = io.connect( host );
	socket.on('connected', function() {
		console.log( 'connected to socket.io server', socket );
	});

	return Module;
});