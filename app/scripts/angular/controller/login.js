define([
  'jquery', 'app', 'config'

], function( $, app, config ) {

  app.controller('LoginController', [
    '$rootScope', '$scope', '$http', '$location',

    function( $rootScope, $scope, $http, $location ) {

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

          $rootScope.$broadcast( 'mad.user-login', res );

          $scope.login.failed = false;
          $location.path('/address');

        }).error( function( res ) {

          $scope.login.failed = true;

        });
      };

      //console.log('routeParams', $location.path() );
    }
  ]);

});