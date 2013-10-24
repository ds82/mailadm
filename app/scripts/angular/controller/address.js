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
    return address;
  }

  function prepareEdit( addr ) {
    addr._update = true;
    addr._id = addr.source;
    addr = splitSource( addr );
    return addr;
  }

  return app.controller('AddressController', [
    '$scope',
    'AddressResource',
    'UserResource',
    'DomainResource',

    function( $scope, Address, User, Domain ) {

      function newAddress() {
        var address = new Address();
        address.enable_greylisting = false;
        address.enable_policyd = false;
        return address;
      }

      $scope.meta = {};
      $scope.addresses = Address.query();
      $scope.address = newAddress();
      $scope.users = User.query();
      $scope.domains = Domain.query();

      $scope.submit = function( addr ) {
        $scope.save( addr, function( err, result ) {
          
          $scope.meta.addressCreated = true;
          $scope.address = newAddress();
        })
      };

      $scope.save = function( address, cb ) {

        address.source = makeSource( address.alias, address.domain );
        address.$save( function( res ) {

          console.log('save', res );

          if ( !address._update ) {
            $scope.addresses.push( address );
          }

          if ( cb ) {
            cb( null, res );
          }
        });
      };

      $scope.edit = function( address ) {

        address = prepareEdit( address );
        $scope.address = address;
      };

      $scope.toggleGreylisting = function( addr ) {
        addr = prepareEdit( addr );
        addr.enable_greylisting = !addr.enable_greylisting;
        $scope.save( addr );
      };

      $scope.togglePolicyd = function( addr ) {
        addr = prepareEdit( addr );
        addr.enable_policyd = !addr.enable_policyd;
        $scope.save( addr );
      };

      $scope.delete = function( address ) {
        address.$delete( function() {
          $scope.addresses.delete( address );
        });
      };
  }]);

});