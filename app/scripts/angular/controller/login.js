define([

	'jquery', 'ang/app', 'config'

], function( $, app, config ) {

	app.controller('LoginController', [
		'$rootScope', '$scope', '$http', '$location',

		function( $rootScope, $scope, $http, $location ) {

			$scope.login = {};
			$scope.login.failed = false;

			$scope.submit = function() {

				$http.post( config.cleanHost + '/login', {
					
					username: $scope.login.username,
					password: $scope.login.password

				}).success( function( res ) {

					console.log('login-res', res);
					$rootScope.$broadcast( 'mad.user-login', res );

					$scope.login.failed = false;
					$location.path('/address');

				}).error( function( res ) {

					$scope.login.failed = true;

				});
			};

			//console.log('routeParams', $location.path() );
		}
	]);

});