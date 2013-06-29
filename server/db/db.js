'use strict';

var 
	pub 			= {},
	_				= {},
	pg 				= require('pg'),
	client			= null,
	db 				= {};

var md5 = function( str ) {
	return function() {
		return 'md5(\''+str+'\')';
	};
};

var arr = function( ax ) {
	return function() {
		'{\'' + ax.join('\', \'') + '\'}';
	};
};

function escapeStrig( str ) {
	return '\'' + str + '\'';
}

function mkSet( field, value, isLast ) {
	
	var s = field + ' = ' + escapeStrig( value );
	if ( !isLast ) s += ', ';
	return s;
}

function mkValueArray( values, keys ) {

	var ax = [];
	for( var i = 0; i < keys.length; ++i ) {
		ax.push( values[ (keys[i]) ]);
	}
	return ax;
}

db.fetchArray = function( q, cb ) {
	console.log('fetchArray', q );
	client.query(
		q,
		function( err, result ) {
			if ( err ) console.log('ERROR', err );
			cb( err, result.rows );
	});
};

db.fetch = function( table, fields, order, cb ) {

	var f = fields.join(', '),
		q = 'SELECT '+ f +' FROM '+ table +' ORDER BY ' + order;
	return db.fetchArray( q, cb );
};


db.insert = function( table, fields, values, check, cb ) {

	var f = '(' + fields.join(',') + ')',
		v = '(';

	for ( var i = 0; i < values.length; ++i ) {

		v += ( typeof( values[i] ) === 'string' ) ?
			escapeStrig( values[i] ) :
			values[i].call({});

		if ( i < values.length - 1 ) v += ', ';
	}
	v += ')';


	var q = 'INSERT INTO ' + table + ' ' + f + ' VALUES ' + v;
	
	console.log('try to execute query', q );
	client.query( q, cb );
};

db.update = function( table, fields, values, where, val, cb ) {

	var q = 'UPDATE ' + table + ' SET ';
	for( var i = 0; i < fields.length; ++i ) {
		q += mkSet( fields[i], values[i], i+1 === fields.length );
	}
	q += ' WHERE ' + where + ' = ' + escapeStrig( val );
	console.log('try to execute query', q );
	client.query( q, cb );
};

db.delete = function( table, where, val, cb ) {
	var q = 'DELETE FROM ' + table + ' WHERE ' + where + ' = ' + escapeStrig( val );
	console.log('try to execute query', q );
	client.query( q, cb );
};

//
// DOMAINS
//

pub.domains = {};
pub.domains.query = function( cb ) {
	db.fetch( 'domains', ['domain', 'parent'], 'parent,domain', cb );
};
pub.domains.save = function( data, cb ) {

	if ( data._update )
		pub.domains.update( data, cb );
	else 
		pub.domains.add( data, cb );
};
pub.domains.add = function( data, cb ) {

	db.insert('domains', ['domain','parent'], [data.domain,data.parent], false, cb );
};
pub.domains.update = function( data, cb ) {
	
	var domain = data._id || data.domain,
		keys = ['domain','parent'],
		vals = mkValueArray( data, keys );

	db.update('domains', keys, vals, 'domain', domain, cb );
};
pub.domains.delete = function( domain, cb ) {
	db.delete( 'domains', 'domain', domain, cb );
};

//
// USER
//
pub.user = {};
pub.user.query = function( cb ) {
	db.fetch('users', ['email','password','enabled','is_admin','domains'], 'email', cb );
};

pub.user.add = function ( user, cb ) {

	db.insert('users', ['email','password'], [user.email, md5(user.plaintext1)], false, cb );
};
pub.user.delete = function( id, cb ) {
	db.delete( 'users', 'email', id, cb );
};


var connect = function( auth ) {
	
	client = new pg.Client( auth );
	client.connect(function ( res ) {
		console.log('connected to pg');
	});
	return pub;
};

module.exports = connect;