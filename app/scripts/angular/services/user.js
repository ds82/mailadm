"use strict";
 /**
 * user
 * @author Dennis Sänger, 2013
 */
define([
	'jquery', 'ang/app', 'config'
], function( $, app, config ) {
 
 	// @todo Refactor name, should be UserResource
	app.factory('UserService', [
		'$resource',
	function( $resource ) {
		return $resource( config.host + '/user/:id', { id: '@email' }, {
			query: {
				method:'GET',
				isArray: true
			}
		});
	}]);

	app.factory('UserServiceLoader', [
		'$q', 'UserService',
	function( $q, service ) {
		return function() {

			var wait = $q.defer();
			service.query(function( data ) {
				wait.resolve( data );
			});

			return wait.promise;
		}
	}]);

});