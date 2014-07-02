"use strict";
 /**
 * user
 * @author Dennis Sänger, 2013
 */
 var $      = require('jquery'),
     app    = require('app'),
     config = require('config');
 
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

app.factory('UserSession', ['$cookieStore', '$location',
function( $cookieStore, $location ) {

  var service = {};

  service.setUser = function( user ) {
    $cookieStore.put( 'user', JSON.stringify( user ));
  };

  service.logout = function() {
    return;
  };

  service.isUserLoggedIn = function() {
    //console.log( 'service.isUserLoggedIn', $location.path(), $cookieStore.get( 'user' ));
    var atLogin = $location.path().match(/\/?login.*/);
    return !atLogin && angular.isDefined( $cookieStore.get( 'user' ));
  };

  service.getUser = function() {
    var str = $cookieStore.get( 'user' ),
        data;
    
    try {
      data = JSON.parse( str );
    } catch ( e ) {
      data = {};
    }
    return data;
  };

  return service;

}]);
