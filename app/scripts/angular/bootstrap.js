"use strict";
 /**
 * angular-bootstrap
 * @author Dennis Sänger, 2013
 */
define([
	'components/angular/angular'
], function( angular ) {
 
	var app = angular.module('app', []);

	$(document).ready(function() {
		
		console.log('bootstrapping angular...');
		var $html = $('html');
		$html.addClass('ng-app="app"');
		angular.bootstrap( $html, [app['name']] );
	});

	return app;

});