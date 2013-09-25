define(['app'], function( app ) {
  
  app.config( function( $routeProvider ) {

    $routeProvider

      .when('/domain', {
        controller: 'DomainController',
        templateUrl: 'partials/domain.html',
        resolve: {
          DomainServiceData: function( DomainServiceLoader ) {
            return DomainServiceLoader();
          }
        },
        auth: true,
        showNavigation: true
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
        },
        auth: true,
        showNavigation: true
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
        },
        auth: true,
        showNavigation: true

      })
      .when('/login', {
        controller: 'LoginController',
        templateUrl: 'partials/login.html',
        resolve: {

        },
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
});