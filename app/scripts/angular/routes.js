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

    .when('/domain/:id/edit', {
      controller: 'DomainEditCtrl',
      templateUrl: 'partials/domain/edit.html',
      resolve: {
        data: ['$route', 'DomainResource', function( $route, resource ) {
          return resource.get({ id: $route.current.params.id }).$promise;
        }]
      },
      auth: true,
      showNavigation: true
    })

    .when('/domain/new', {
      controller: 'DomainEditCtrl',
      templateUrl: 'partials/domain/edit.html',
      resolve: {
        data: ['DomainResource', function( resource ) {
          var domain = new resource();
          domain.$new = true;
          return domain;
        }]
      },
      auth: true,
      showNavigation: true
    })

    .when('/user', {
      controller: 'UserController',
      templateUrl: 'partials/user/list.html',
      resolve: {
      },
      auth: true,
      showNavigation: true
    })

    .when('/user/:id/edit', {
      controller: 'UserEditCtrl',
      templateUrl: 'partials/user/edit.html',
      resolve: {
        isNew: function() {
          return false;
        },
        userData: ['$route', 'UserResource', function( $route, UserResource ) {
          return UserResource.get({ id: $route.current.params.id }).$promise;
        }],
        domainData: ['DomainResource', function( DomainResource ) {
          return DomainResource.query().$promise;
        }]
      },
      auth: true,
      showNavigation: true
    })

    .when('/user/create', {
      controller: 'UserEditCtrl',
      templateUrl: 'partials/user/edit.html',
      resolve: {
        isNew: function() {
          return true;
        }
      },
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
