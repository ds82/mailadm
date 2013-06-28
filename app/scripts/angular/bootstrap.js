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
			.when('/company', {
				controller: 'CompanyListController',
				templateUrl: 'partials/company/list.html',
				resolve: {
					companies: function( CompanyList ) {
						return CompanyList();
					}
				}
			})
			.when('/people/edit/:peopleId', {
				controller: 'PeopleEditController',
				templateUrl: 'partials/people/edit.html',
				resolve: {
					people: function( PeopleFetcher ) {
						return PeopleFetcher();
					}
				}
			})
			.when('/people', {
				controller: 'PeopleListController',
				templateUrl: 'partials/people/list.html',
				resolve: {
					people: function( PeopleList ) {
						return PeopleList();
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