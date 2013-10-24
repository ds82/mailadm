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
			if ( ! domains ) return filtered;

			for ( var i = 0; i < domains.length; ++i ) {
				if ( !domains[i].parent || 
						domains[i].parent === domains[i].domain ) {
					filtered.push( domains[i] );
				}
			}
			return filtered;
		};
	});

	app.controller('DomainController',[
		'$scope', 'DomainResource',

		function( $scope, DomainResource ) {

			$scope.domains = DomainResource.query();
			$scope.dom = new DomainResource();

			$scope.formatChilds = function( childs ) {

				if ( ! childs ) {
					return '';
				}
				var list = childs.map(function( item ) {
					return item.domain;
				});
				return list.join(', ');
			};

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