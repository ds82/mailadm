'use strict';

var 
	pub 			= {},
	_				= {},
	pg 				= require('pg'),
	client			= null,
	db 				= {};

db.fetchArray = function( q, cb ) {
	client.query(
		q,
		function( err, result ) {
			console.log('res', err, result );
			cb( err, result.rows );
	});

};

db.insert = function( table, fields, values, check, cb ) {

	var f = '(' + fields.join(',') + ')',
		v = '(\'' + values.join('\', \'') + '\')',
		q = 'INSERT INTO ' + table + ' ' + f + ' VALUES ' + v;
	
	console.log('try to execute query', q );
	client.query( q, cb );
};

pub.domains = {};
pub.domains.get = function( cb ) {
	db.fetchArray(
		'SELECT domain FROM domains ORDER BY domain',
		function(err, res ) {
			cb( err, res );
	});
};
pub.domains.add = function( data, cb ) {

	db.insert('domains', ['domain'], [data.domain], cb );
};


var connect = function( auth ) {
	
	client = new pg.Client( auth );
	client.connect(function ( res ) {
		console.log('connected to pg');
	});
	return pub;
};

module.exports = connect;