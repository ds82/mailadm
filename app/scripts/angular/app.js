'use strict';
 /**
 * app
 * @author Dennis Sänger, 2013
 */
define([
    'jquery',
    'angularjs',
    'angular/extensions'
], function( $, angularjs ) {

    var app = angularjs.module('app', [
      'ngResource', 'ngRoute', 'ngAnimate'
    ]);
    return app;

});