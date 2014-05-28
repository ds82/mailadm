"use strict";

var $      = require('jquery'),
    app    = require('app'),
    config = require('config');

app.controller('NavController', [
  '$scope', 'UserSession',
  function( $scope, Session ) {

    $scope.session = Session;
    $scope.user = Session.getUser();
  }
]);
