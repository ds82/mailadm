 /**
 * people
 * @author Dennis Sänger, 2013
 */
define([

	'jquery', 'ang/app', 'config'

], function( $, app, config ) {
	"use strict";

	app.controller('DomainController',[
		'$scope',
		'DomainService',
		'DomainServiceData',

	function( $scope, DomainService, domains ) {
		
		$scope.domains = domains;
		$scope.add = new DomainService();

		$scope.addDomain = function( domain ) {

			domain.$save();
		};

	}]);

});