"use strict";
 /**
 * angular-bootstrap
 * @author Dennis Sänger, 2013
 */
define([
	'jquery',
	'_angular',
	'angular-resource',
	'angular-strap'
], function( $, angular ) {
 
	console.log( angular );
	return angular.module( 'app', ['ngResource', '$strap.directives'] );

});