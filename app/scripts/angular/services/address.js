 /**
 * address
 * @author Dennis Sänger, 2013
 */
define([
  'jquery', 'app', 'config'
], function( $, app, config ) {
  'use strict';

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

});


