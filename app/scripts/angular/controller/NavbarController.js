"use strict";
 /**
 * NavbarController
 * @author Dennis Sänger, 2013
 */
define([
	'jquery', 'ang/app', 'config'
], function( $, ang, config ) {
 
	ang.factory('NavbarService', ['$resource', function( $resource ) {

		return $resource( config.host + '/navbar', {},
		{
			query: {
				method:'GET',
				isArray: true
			}
		});
	}]);

	ang.controller('NavbarController', [ '$scope', 'NavbarService', function( $scope, Navbar ) {

		$scope.navbar = Navbar.query(function() {
			console.log( $scope.navbar );
		});
	}]);

});