 /**
 * address
 * @author Dennis Sänger, 2013
 */
define([
  'jquery', 'app'
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
    'AddressResource',
    'UserResource',
    'DomainResource',

    function( $scope, Address, User, Domain ) {

      function newAddress() {
        var address = new Address();
        address.enable_greylisting = true;
        return address;
      }

      $scope.meta = {};
      $scope.addresses = Address.query();
      $scope.address = newAddress();
      $scope.users = User.query();
      $scope.domains = Domain.query();

      $scope.save = function( address ) {

        address.source = makeSource( address.alias, address.domain );
        address.$save( function() {
          
          if ( !address._update )
            $scope.addresses.push( address );
        });
        $scope.meta.addressCreated = true;
        $scope.address = newAddress();
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