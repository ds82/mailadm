 /**
 * address
 * @author Dennis Sänger, 2013
 */
define([
	'jquery', 'ang/app', 'config'
], function( $, app, config ) {
	'use strict';

	app.factory('AddressService', [
		'$resource',
	function( $resource ) {
		return $resource( config.host + '/address/:id', { id: '@source' }, {
			query: {
				method:'GET',
				isArray: true
			}
		});
	}]);

	app.factory('AddressServiceLoader', [
		'$q', 'AddressService',
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