define([
  
  'jquery', 'app', 'config'

], function( $, app, config ) {
  "use strict";

  app.controller('NavController', [
    '$scope', 'UserSession',
    function( $scope, Session ) {

      $scope.session = Session;
      $scope.user = Session.getUser();
    }
  ]);
});