'use strict';

var _				= {},
	mongoose		= require('mongoose'),
	goose			= new require('./schema').Schema( mongoose ),
	q				= require('q');



var connected = (function() {
	var deferred = q.defer(),
		db = mongoose.connection;

	mongoose.connect('mongodb://localhost/crm');

	db.on('error', function() {
		deferred.reject('connection error');
	});

	db.once('open', function() {

		console.log('connected');
		deferred.resolve( goose );
	});

	return deferred.promise;
})();

// tests
// console.log('runnig tests ...');
// connected().then(function( goose ) {

// 	goose.models.people.find({}).execFind(function( err, data ) {
// 		console.log('people:');
// 		console.log( err, data );
// 	});
// });

module.exports = function( entity, err, cb ) {
	connected.then(function( goose ) {
		cb( goose.models[entity] );
	}).done();
};