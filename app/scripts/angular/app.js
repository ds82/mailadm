'use strict';
 /**
 * app
 * @author Dennis Sänger, 2013
 */

var $          = require( 'jquery' ),
    ng         = require( 'angularjs' ),
    extensions = require( './extensions' );

var app = angular.module('app', [
  'ngResource',
  'ngRoute',
  'ngCookies',
  'ngAnimate',
  'pascalprecht.translate',
  'frapontillo.bootstrap-switch',
  'io.dennis.contextmenu'
]);

module.exports = app;
