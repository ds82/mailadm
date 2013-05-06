"use strict";
 /**
 * angular-bootstrap
 * @author Dennis Sänger, 2013
 */
define([
	'jquery',
	'components/angular/angular',
	'components/angular-resource/angular-resource'
], function( $, angular ) {
 
	var app = angular.module( 'app', ['ngResource'] );
	
	return app;
});