 /**
 * 401
 * @author Dennis Sänger, 2013
 */
 var $      = require('jquery'),
     app    = require('app'),
     config = require('config');

app.config(function ($routeProvider, $locationProvider, $httpProvider) {

  var interceptor = [
    '$rootScope', '$q', '$location', '$injector',
    function ( scope, $q, $location, injector ) {

      function success( response ) {
        return response;
      }

      function error( response ) {
        var status = response.status;

        if (status == 401) {
          $location.path('/login');
        }
        return $q.reject(response);
      }

      return function (promise) {
        return promise.then(success, error);
      }
  }];
  $httpProvider.responseInterceptors.push(interceptor);
});
