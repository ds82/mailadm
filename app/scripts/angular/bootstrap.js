'use strict';
 /**
 * angular-modules
 * @author Dennis Sänger, 2013
 */
define([
	'jquery',
	'ang/app',
	'_angular',
	'ang/controller',
	'ang/services'
], function( $, app, angular ) {

	app.config( function( $routeProvider ) {

		$routeProvider

			.when('/domain', {
				controller: 'DomainController',
				templateUrl: 'partials/domain.html',
				resolve: {
					DomainServiceData: function( DomainServiceLoader ) {
						return DomainServiceLoader();
					}
				}
			})
			.when('/user', {
				controller: 'UserController',
				templateUrl: 'partials/user.html',
				resolve: {
					UserServiceData: function( UserServiceLoader ) {
						return UserServiceLoader();
					},
					DomainServiceData: function( DomainServiceLoader ) {
						return DomainServiceLoader();
					}
				}
			})
			.when('/address', {
				controller: 'AddressController',
				templateUrl: 'partials/address.html',
				resolve: {
					AddressServiceData: function( AddressServiceLoader ) {
						return AddressServiceLoader();
					},
					UserServiceData: function( UserServiceLoader ) {
						return UserServiceLoader();
					},
					DomainServiceData: function( DomainServiceLoader ) {
						return DomainServiceLoader();
					}
				}
			})
		;
	});

	$(document).ready(function() {

		console.log('bootstrapping angular...');
		var $html = $('html');
		$html.addClass('ng-app="app"');
		angular.bootstrap( $html, [app['name']] );
	});

});