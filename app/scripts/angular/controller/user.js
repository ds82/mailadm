 /**
 * user
 * @author Dennis Sänger, 2013
 */
define([

	'jquery', 'ang/app', 'config'

], function( $, app, config ) {
	'use strict';

	function fixupUser( user ) {
		
		var tmp = user.email.split('@');
		user.alias = tmp[0];
		user.domain = tmp[1];
	}

	app.controller('UserController',[
		'$scope',
		'UserService',
		'UserServiceData',
		'DomainServiceData',

		function( $scope, UserService, data, domains ) {

			function createUser() {

				var user = new UserService();
				user._setpw = true;
				user.enabled = true;
				user.is_admin = false;
				return user;
			}

			$scope.data = data;
			$scope.domains = domains;
			
			$scope.user = createUser();
			
			$scope.meta = {};
			$scope.meta.userCreated = false;

			$scope.edit = function( user ) {
				
				// tell server to update user instead of inserting
				user._update = true;
				user._setpw = false;

				user._id = user.email;
				$scope.user = user;
			};

			$scope.save = function( user ) {

				fixupUser( user );
				user.$save(function( res ) {
					
					if ( ! user._update )
						$scope.data.push( user );
					
					$scope.meta.userCreated = true;
					createUser( $scope.user );
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