"use strict";
 /**
 * angular-modules
 * @author Dennis Sänger, 2013
 */
define([
	'jquery',
	'ang/app',
	'components/angular/angular',
	'ang/controller'
], function( $, app, angular ) {

	$(document).ready(function() {
		
		console.log('bootstrapping angular...');
		var $html = $('html');
		$html.addClass('ng-app="app"');
		angular.bootstrap( $html, [app['name']] );
	});


});