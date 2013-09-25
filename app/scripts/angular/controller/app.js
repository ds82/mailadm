 /**
 * app
 * @author Dennis Sänger, 2013
 */
define([
	'jquery', 'app'
], function( $, app ) {
	'use strict';

	return app.controller('AppController', [ '$scope', function( $scope ) {

		$scope.appname = 'crm';
	}]);

});