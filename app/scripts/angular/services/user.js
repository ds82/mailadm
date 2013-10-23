"use strict";
 /**
 * user
 * @author Dennis Sänger, 2013
 */
define([
  'jquery', 'app', 'config'
], function( $, app, config ) {
 
  // @todo Refactor name, should be UserResource
  app.factory('UserResource', [
    '$resource',
  function( $resource ) {
    return $resource( config.host + '/user/:id', { id: '@email' }, {
      query: {
        method:'GET',
        isArray: true
      }
    });
  }]);

});