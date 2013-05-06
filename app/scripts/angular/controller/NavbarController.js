"use strict";
 /**
 * NavbarController
 * @author Dennis Sänger, 2013
 */
define([
	'jquery', 'ang/app', 'config'
], function( $, app, config ) {
 
	app.factory('NavbarService', ['$resource', function( $resource ) {

		return $resource( config.host + '/navbar', {},
		{
			query: {
				method:'GET',
				isArray: true
			}
		});
	}]);

	app.controller('NavbarController', [ '$scope', 'NavbarService', function( $scope, Navbar ) {

		$scope.navbar = Navbar.query(function() {
			console.log( $scope.navbar );
		});
	}]);

});