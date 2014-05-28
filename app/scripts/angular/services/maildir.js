"use strict";
 /**
 * user
 * @author Dennis Sänger, 2013
 */

 var $      = require('jquery'),
     app    = require('app'),
     config = require('config');
 
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
