var app = require('app');

app.config( function( $routeProvider ) {

  $routeProvider

    .when('/domain', {
      controller: 'DomainController',
      templateUrl: 'partials/domain.html',
      resolve: {},
      auth: true,
      showNavigation: true
    })
    
    .when('/user', {
      controller: 'UserController',
      templateUrl: 'partials/user.html',
      resolve: {},
      auth: true,
      showNavigation: true
    })

    .when('/user/edit/:id', {
      controller: 'UserEditCtrl',
      templateUrl: 'partials/user-edit.html',
      resolve: {},
      auth: true,
      showNavigation: true
    })

    .when('/address', {
      controller: 'AddressController',
      templateUrl: 'partials/address.html',
      resolve: {},
      auth: true,
      showNavigation: true

    })
    .when('/login', {
      controller: 'LoginController',
      templateUrl: 'partials/login.html',
      resolve: {},
      auth: false,
      showNavigation: false

    })

    .when('/blocked', {
      controller: 'BlockedController',
      templateUrl: 'partials/blocked.html',
      auth: true,
      showNavigation: true
    })
    
    .otherwise({ redirectTo: '/login' });
  ;
});
