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

  app.factory('UserSession', ['$cookieStore', function( $cookieStore ) {

    var service = {};

    service.setUser = function( user ) {
      $cookieStore.put( 'user', JSON.stringify( user ));
    };

    service.isUserLoggedIn = function() {
      return ( $cookieStore.get( 'user' ) != null );
    };

    service.getUser = function() {
      var str = $cookieStore.get( 'user' );
      return ( str ) ? JSON.parse( str ) : {};
    };

    return service;

  }]);

});