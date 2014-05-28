"use strict";
 /**
 * domain
 * @author Dennis Sänger, 2013
 */
 
 var $      = require('jquery'),
     app    = require('app'),
     config = require('config');

app.factory('DomainResource', [
  '$resource',
function( $resource ) {
  return $resource( config.host + '/domain/:id', { id: '@domain' }, {
    query: {
      method:'GET',
      isArray: true
    }
  });
}]);

app.factory('DomainServiceLoader', [
  '$q', 'DomainResource',
function( $q, service ) {
  return function() {

    var wait = $q.defer();
    service.query(function( data ) {
      wait.resolve( data );
    });

    return wait.promise;
  }
}]);
