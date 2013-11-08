define([
  
  'jquery', 'app', 'config'

], function( $, app, config ) {
  "use strict";

  app.controller('NavController', [
    '$rootScope', '$scope', '$location',
    function( $rootScope, $scope, $location ) {

      $scope.showNavigation = ( $location.path() === '/login' ) ?
        false : true ;

      $scope.user = {};
      $scope.$on( 'mad.user-login', function( ev, data ) {
        console.log('mad.user-login', data );
        $scope.user = data;
        $scope.showNavigation = true;
      });

      // $scope.$on('$routeChangeStart', function( event, next, current ) {
      //   $scope.showNavigation = next.showNavigation || false;
      // });

    }
  ]);
});