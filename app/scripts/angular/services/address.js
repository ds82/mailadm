"use strict";
 /**
 * AddressService
 * @author Dennis Sänger, 2013
 */
define([
	'jquery', 'ang/app', 'config'
], function( $, app, config ) {
 
	app.factory('Address', ['$resource', function( $resource ) {

		return $resource( config.host + '/address/:id', {
			id: '@id'
		},
		{
			query: {
				method:'GET',
				isArray: true
			},
			search: {
				method: 'GET',
				isArray: true,
				url: config.host + '/address/search',
				cache: false,
				// WORKAROUND until using angular 1.1.x and url works
				params: { id: 'search' }
			}
		});
	}]);


});