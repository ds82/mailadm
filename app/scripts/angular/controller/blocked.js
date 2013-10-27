 /**
 * blocked
 * @author Dennis Sänger, 2013
 */
define([
  'jquery', 'app'
], function( $, app ) {
  'use strict';

  var defaultAction = 'REJECT';

  function prepareEdit( addr ) {
    addr._update = true;
    addr._id = addr.destination;
    return addr;
  }

  return app.controller('BlockedController', [
    '$scope', 'BlockedResource', 'DomainResource',
    function( $scope, Blocked, Domain ) {

      $scope.list = Blocked.query();
      $scope.address = new Blocked();
      $scope.domains = Domain.query();

      $scope.submit = function( addr ) {
        addr.destination = addr.alias + '@' + addr.domain;
        addr.action = defaultAction;
        $scope.save( addr );
      };

      $scope.save = function( address ) {

        address.$save(function( res ) {

          if ( ! address._update ) {
            $scope.list.push( address );
          }
          $scope.address = new Blocked();
        });
      };

      $scope.delete = function( address ) {
        address.$delete(function( res ) {
          $scope.list.delete( address );
        });
      };

      $scope.set = function( addr, action ) {
        addr = prepareEdit( addr );
        addr.action = action;
        $scope.save( addr );
      };
  }]);

});