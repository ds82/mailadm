'use strict';
 /**
 * blocked
 * @author Dennis Sänger, 2013
 */

 var $      = require('jquery'),
     app    = require('app'),
     config = require('config');

app.factory('BlockedResource', [
  '$resource',
function( $resource ) {
  return $resource( config.host + '/blocked/:id', { id: '@destination' }, {
    query: {
      method:'GET',
      isArray: true
    }
  });
}]);
