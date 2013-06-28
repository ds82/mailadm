"use strict";
 /**
 * Company Service
 * @author Dennis Sänger, 2013
 */
define([
	'jquery', 'ang/app', 'config'
], function( $, app, config ) {
 
	app.factory('Company', ['$resource', function( $resource ) {

		return $resource( config.host + '/company/:id', {
			id: '@id'
		},
		{
			query: {
				method:'GET',
				isArray: true
			}
		});
	}]);

	app.factory('CompanyList', ['Company', '$q', function( Company, $q ) {
		return function() {
			var wait = $q.defer();
			Company.query(function( _company ) {
				wait.resolve( _company );
			}, function() {
				wait.reject('unable to fetch companies from server');
			});
			return wait.promise;
		};
	}]);



});