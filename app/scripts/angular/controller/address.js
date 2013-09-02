 /**
 * address
 * @author Dennis Sänger, 2013
 */
define([
	'jquery', 'ang/app'
], function( $, app ) {
	'use strict';

	function makeSource( alias, domain ) {
		return alias + '@' + domain;
	}

	function splitSource( address ) {
		var tmp = address.source.split('@');
		address.alias = tmp[0];
		address.domain = tmp[1];
	}

	return app.controller('AddressController', [
		'$scope',
		'AddressServiceData',
		'AddressService',
		'UserServiceData',
		'DomainServiceData',

		function(
			$scope,
			addresses,
			AddressService,
			users,
			domains
		) {

			$scope.meta = {};
			$scope.addresses = addresses;
			$scope.address = new AddressService();
			$scope.users = users;
			$scope.domains = domains;

			$scope.save = function( address ) {

				address.source = makeSource( address.alias, address.domain );
				address.$save( function() {
					
					if ( !address._update )
						$scope.addresses.push( address );
				});
				$scope.address = new AddressService();
			};

			$scope.edit = function( address ) {

				address._update = true;
				address._id = address.source;
				splitSource( address );

				$scope.address = address;
			};

			$scope.delete = function( address ) {
				address.$delete( function() {
					$scope.addresses.delete( address );
				});
			};
	}]);

});