"use strict";
 /**
 * user
 * @author Dennis Sänger, 2013
 */
define([
  'jquery', 'app', 'config'
], function( $, app, config ) {
 
  // @todo Refactor name, should be UserResource
  app.factory('MaildirResource', [
    '$resource',
  function( $resource ) {
    return $resource( config.host + '/maildir/:email', { email: '@email' }, {
      query: {
        method:'GET',
        isArray: true
      }
    });
  }]);

});