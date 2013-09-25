 /**
 * blocked
 * @author Dennis Sänger, 2013
 */
define([
  'jquery', 'app', 'config'
], function( $, app, config ) {
  'use strict';

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

});


