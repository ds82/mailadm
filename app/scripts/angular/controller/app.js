"use strict";
 /**
 * app
 * @author Dennis Sänger, 2013
 */
define([
	'jquery', 'ang/app'
], function( $, app ) {

	return app.controller('AppController', [ '$scope', function( $scope ) {

		$scope.appname = 'crm';
	}]);

});