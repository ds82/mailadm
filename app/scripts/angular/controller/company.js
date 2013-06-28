"use strict";
 /**
 * company
 * @author Dennis Sänger, 2013
 */
define([
	'jquery', 'ang/app', 'config'
], function( $, app, config ) {
 
	app.controller('CompanyListController', [ '$scope', 'companies', function( $scope, companies ) {
		
		$scope.people = companies;




	}]);


});