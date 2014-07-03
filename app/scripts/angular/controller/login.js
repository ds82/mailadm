var $      = require('jquery'),
    app    = require('app'),
    config = require('config');

app.controller('LoginCtrl', [
  '$scope', '$http', '$location', 'UserSession', 'logout',

  function( $scope, $http, $location, Session, logout ) {

    $scope.meta = {};
    $scope.meta.isLoading = false;

    $scope.login = {};
    $scope.login.failed = false;

    var httpConfig = {
      headers: { 'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8' }
    };

    $scope.submit = function( login ) {

      console.log( 'login..' );

      $scope.meta.isLoading = true;
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

      }).finally(function() {
        $scope.meta.isLoading = false;
      });
    };

    //console.log('routeParams', $location.path() );
  }
]);
