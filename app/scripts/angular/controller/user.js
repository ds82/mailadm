 /**
 * user
 * @author Dennis Sänger, 2013
 */
define([

	'jquery', 'ang/app', 'config'

], function( $, app, config ) {
	'use strict';

	app.controller('UserController',[
		'$scope',
		'UserService',
		'UserServiceData',
		'DomainServiceData',

		function( $scope, UserService, data, domains ) {

			$scope.data = data;
			$scope.domains = domains;
			$scope.user = new UserService();

			$scope.meta = {};
			$scope.meta.userCreated = false;

			$scope.edit = function( user ) {
				// tell server to update user instead of inserting
				$scope.user._update = true;
				$scope.user = user;
			};

			$scope.add = function( user ) {

				user.$save(function( res ) {
					
					$scope.data.push( user );
					$scope.meta.userCreated = true;
					$scope.user = new UserService();
				});
			};

			$scope.delete = function( user ) {
				user.$delete(function( res ) {
					$scope.data.delete( user );
				});
			};

			$scope.enable =  function( user ) {
				console.log('user', user );
			};

			$scope.validatePassword = function( user ) {

				$scope.userForm.plaintext1.$valid =
					user.plaintext1.length > 5 &&
					( user.plaintext1 ===  user.plaintext2 );
			};

		}]);

});