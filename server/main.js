'use strict';

var express		= require('express'),
	app			= express(),
	server		= require('http').createServer(app),
	io			= require('socket.io').listen(server),
	config 		= require('./config.json'),
	db			= require('./db/db')( config.pg_connect );

var allowCrossDomain = function( req, res, next ) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	if ( next ) {
		next();
	}
};
//app.listen(9000);

app.configure(function() {
	app.use( allowCrossDomain );
	app.use( express.bodyParser() );
});

app.options('*', function(req, res) {
	res.send(200);
	res.end();
});

//
// DOMAIN
//
app.get('/domain', function( req, res ) {
	
	db.domains.query( function( err, data ) {
		if ( err ) res.send( err );
		else res.send( data );
	});
});

app.post('/domain/:id', function( req, res ) {

	db.domains.save( req.body, function( err, data ) {
		res.send( req.body );
	});
});

app.delete('/domain/:id', function( req, res ) {
	db.domains.delete( req.params.id, function( err, data ) {
		res.send( data );
	});
});

//
// USER
//

app.get('/user', function( req, res ) {
	db.user.query( function( err, data ) {
		res.send( data );
	});
});

app.post('/user/:id?', function( req, res ) {

	console.log('post,user', req.body );
	db.user.save( req.body, function( err, data ) {
		res.send( req.body );
	});
});

app.delete('/user/:id', function( req, res ) {

	db.user.delete( req.params.id, function( err, data ) {
		res.send( data );
	});
});


//
// ADDRESS
//
app.get('/address', function( req, res ) {
	db.address.query( function( err, data ) {
		res.send( data );
	});
});

app.post('/address/:id?', function( req, res ) {
	db.address.save( req.body, function( err, data ) {
		res.send( req.body );
	});
});

app.delete('/address/:id', function( req, res ) {
	db.address.delete( req.params.id, function( err, data ) {
		res.send( data );
	});
});

//
// SOCKET
//
io.sockets.on('connection', function (socket) {
	socket.emit('connected', { hello: 'world' });
});

exports = module.exports = server;
// delegates user() function
exports.use = function() {
	app.use.apply(app, arguments);
};
