"use strict";
 /**
 * NavbarController
 * @author Dennis Sänger, 2013
 */
define([
	'jquery', 'ang/app'
], function( $, ang ) {
 
	var host = 'http://localhost\\:9001';

	ang.factory('NavbarService', ['$resource', function( $resource ) {

		return $resource( host + '/navbar', {},
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