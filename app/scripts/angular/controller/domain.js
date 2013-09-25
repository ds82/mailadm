 /**
 * people
 * @author Dennis Sänger, 2013
 */
define([

	'jquery', 'app', 'config'

], function( $, app, config ) {
	"use strict";

	app.filter('parentDomain', function() {
		return function( domains ) {
			
			var filtered = [];
			for ( var i = 0; i < domains.length; ++i ) {
				if ( domains[i].parent === domains[i].domain ||
					 domains[i].parent === '' ||
					 domains[i].parent == null
				)
					filtered.push( domains[i] );
			}
			return filtered;
		};
	});

	app.controller('DomainController',[
		'$scope',
		'DomainResource',
		'DomainServiceData',

	function( $scope, DomainResource, domains ) {
		
		$scope.domains = domains;
		$scope.dom = new DomainResource();

		$scope.save = function( domain ) {

			domain.$save( function( res ) {

				if ( ! domain._update ) {
					$scope.domains.push( domain );
				}
				$scope.dom = new DomainResource();
			});
		};

		$scope.edit = function( domain ) {

			// save references
			domain._id = domain.domain;
			domain._update = true;

			$scope.dom = domain;
		};

		$scope.delete = function( domain ) {

			domain.$delete( function( res ) {
				$scope.domains.delete( domain );
			});
		};

	}]);

});