 /**
 * app
 * @author Dennis Sänger, 2013
 */
 var $   = require('jquery'),
     app = require('app');

return app.controller('AppController', [ '$scope', function( $scope ) {
  $scope.appname = 'crm';
}]);
