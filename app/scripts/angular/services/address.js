 /**
 * address
 * @author Dennis Sänger, 2013
 */
'use strict';

var $      = require('jquery'),
    app    = require('app'),
    config = require('config');

app.factory('AddressResource', [
  '$resource',
function( $resource ) {
  return $resource( config.host + '/address/:id', { id: '@source' }, {
    query: {
      method:'GET',
      isArray: true
    }
  });
}]);
