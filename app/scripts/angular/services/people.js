"use strict";
 /**
 * PeopleService
 * @author Dennis Sänger, 2013
 */
define([
	'jquery', 'ang/app', 'config'
], function( $, app, config ) {
 
	app.factory('People', ['$resource', function( $resource ) {

		return $resource( config.host + '/people/:id', {
			id: '@id'
		},
		{
			query: {
				method:'GET',
				isArray: true
			}
		});
	}]);

	app.factory('PeopleList', ['People', '$q', function( People, $q ) {
		return function() {
			var wait = $q.defer();
			People.query(function( _people ) {
				wait.resolve( _people );
			}, function() {
				wait.reject('unable to fetch people from server');
			});
			return wait.promise;
		};
	}]);

	app.factory('PeopleFetcher', ['People', '$q', '$route', function( People, $q, $route ) {
		return function() {
			var wait = $q.defer(),
				_id = $route.current.params.peopleId;

			People.get({ id: _id }, function( people ){
				wait.resolve( people );
			}, function() {
				wait.reject('unable to get person with id ' + _id );
			});

			return wait.promise;
		};
	}]);

});