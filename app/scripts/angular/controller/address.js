'use strict';
 /**
 * address
 * @author Dennis Sänger, 2013
 */
var $   = require('jquery'),
    app = require('app');

function makeSource( alias, domain ) {
  return alias + '@' + domain;
}

function makeDestination( addr ) {
  console.log('makeDestination', addr );
  if ( addr.destinationsAsList ) {
    return addr.destinationsAsList.join(' ');
  }
  return '';
};

function splitSource( address ) {
  var tmp = address.source.split('@');
  address.alias = tmp[0];
  address.domain = tmp[1];
  return address;
}

function prepareEdit( addr ) {
  
  addr.meta = addr.meta || {};

  addr.meta.update = true;
  addr.meta.id = addr.source;
  addr = splitSource( addr );
  addr.destinationsAsList = addr.destination.split(/[\s]/);
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
      address.destinationsAsList = [''];
      return address;
    }

    $scope.meta = {};
    $scope.addresses = Address.query();
    $scope.address = newAddress();
    $scope.users = User.query();
    $scope.domains = Domain.query();
    $scope.selectedDomain = '';

    $scope.filterByDomain = function( row ) {
      
      if ( $scope.selectedDomain === '-' ) {
        return false;
      }
      var filter = new RegExp( '.*@' + $scope.selectedDomain );
      return filter.test( row.source ) || filter.test( row.destination );
    };

    $scope.submit = function( addr ) {
      $scope.save( addr, function( err, result ) {
        
        $scope.meta.addressCreated = true;
        $scope.address = newAddress();
      })
    };

    $scope.save = function( address, cb ) {

      address.source = makeSource( address.alias, address.domain );
      address.destination = makeDestination( address );
      address.$save( function( res ) {

        if ( !address.meta.update ) {
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

    $scope.addDestination = function( addr ) {
      addr.destinationsAsList.push('');
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
