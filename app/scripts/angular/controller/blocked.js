 /**
 * blocked
 * @author Dennis Sänger, 2013
 */
define([
  'jquery', 'app'
], function( $, app ) {
  'use strict';

  return app.controller('BlockedController', [
    '$scope', 'BlockedResource', 'DomainResource',
    function( $scope, Blocked, Domain ) {

      $scope.list = Blocked.query();
      $scope.address = new Blocked();

      $scope.domains = Domain.query();

      $scope.save = function( address ) {
        address.destination = address.alias + '@' + address.domain;
        address.$save(function( res ) {
          $scope.list.push( address );
          $scope.address = new Blocked();
        });
      };

      $scope.delete = function( address ) {
        address.$delete(function( res ) {
          $scope.list.delete( address );
        });
      };
  }]);

});