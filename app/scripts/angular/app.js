"use strict";
 /**
 * angular-bootstrap
 * @author Dennis Sänger, 2013
 */
define([
	'jquery',
	'_angular',
	'angular-resource',
  'angular-route',
  'angular-animate',
], function( $, angular ) {
 

	return angular.module( 'app', ['ngResource', 'ngRoute', 'ngAnimate'] );

});