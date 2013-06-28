'use strict';

var express		= require('express'),
	app			= express(),
	server		= require('http').createServer(app),
	io			= require('socket.io').listen(server),
	db			= require('./db/db');

var allowCrossDomain = function( req, res, next ) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	if ( next ) {
		next();
	}
};

app.configure(function() {
	app.use( allowCrossDomain );
	app.use( express.bodyParser() );
});

app.options('*', function(req, res) {
	res.send(200);
	res.end();
});


app.get('/navbar', function (req, res) {
	res.send({ hello: 'world' });
});

app.get('/people', function( req, res ) {
	// console.log( db );
	db( 'people', {} , function( q ) {

		q.find({})
			.execFind(function( err, data ) {
		console.log( err, data );
		res.send( data );
		res.end();
	})});
});

app.get('/people/:id', function( req, res ) {

	// console.log( 'people/id', req.params );
	db( 'people', {} , function( q ) {

		q.findOne({ _id: req.params.id })
			.populate('address')
			.execFind(function( err, data ) {
				res.send( data.shift() );
				res.end();
	})});
});

app.get('/company', function( req, res ) {
	// console.log( db );
	db( 'companies', {} , function( q ) {

		q.find({})
			.execFind(function( err, data ) {
		console.log( err, data );
		res.send( data );
		res.end();
	})});
});

var addressSearchFields = ['street', 'zip', 'city', 'country'];

function buildSearchQuery( fields, search ) {
	
	var query = [], tmp;
	for( var j = 0; j < search.length; ++j ) {
		for( var i = 0; i < fields.length; ++i ) {
			tmp = {};
			tmp[(fields[i])] = new RegExp( search[j], 'i');
			query.push( tmp );
		}
	}
	return query;
}


app.get('/address/search', function( req, res ) {

	var query = req.query.query.split(' ');

	console.log('called /address/search', req.params, query );
	if ( !query  ) res.send([]);

	db( 'addresses', {} , function( q ) {

		q.find({ $or:buildSearchQuery( addressSearchFields, query ) },
		function( err, data ) {
			console.log( err, data );
			res.send( data );
			res.end();
	})});
});


io.sockets.on('connection', function (socket) {
	socket.emit('connected', { hello: 'world' });
});

exports = module.exports = server;
// delegates user() function
exports.use = function() {
	app.use.apply(app, arguments);
};
