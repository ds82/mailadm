var $      = require('jquery'),
    app    = require('app'),
    config = require('config');

app.controller('LoginController', [
  '$scope', '$http', '$location', 'UserSession',

  function( $scope, $http, $location, Session ) {

    $scope.login = {};
    $scope.login.failed = false;

    var httpConfig = {
      headers: { 'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8' }
    };

    $scope.submit = function( login ) {

      var credentials = {
        username: login.username,
        password: login.password
      };

      $http.post( config.cleanHost + '/login',
          $.param( credentials ),
          httpConfig
      ).success( function( res ) {

        console.log( 'user logged in', res );
        Session.setUser( res );

        $scope.login.failed = false;
        $location.path('/address');

      }).error( function( res ) {

        $scope.login.failed = true;

      });
    };

    //console.log('routeParams', $location.path() );
  }
]);
