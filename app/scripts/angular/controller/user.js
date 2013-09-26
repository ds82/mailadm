 /**
 * user
 * @author Dennis Sänger, 2013
 */
define([

  'jquery', 'app', 'config'

], function( $, app, config ) {
  'use strict';

  function fixupUser( user ) {
    
    var tmp = user.email.split('@');
    user.alias = tmp[0];
    user.domain = tmp[1];
  }

  function createUser( UserService ) {

    var user = new UserService();
    user._setpw = true;
    user.enabled = true;
    user.is_admin = false;
    return user;
  }

  app.controller('UserController',[
    '$scope',
    'UserService',
    'UserServiceData',
    'DomainServiceData',

    function( $scope, UserService, data, domains ) {

      $scope.data = data;
      $scope.domains = domains;
      
      $scope.meta = {};
      $scope.meta.userCreated = false;
      
      $scope.meta.show = {};
      $scope.meta.show.userAdd = false;

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

      $scope.addUser = function() {
        $scope.meta.show.userAdd = true;
      };

      $scope.cancelEditUser = function() {
        $scope.meta.show.userAdd = false;
      };

    }]);


 app.controller('UserEditCtrl',[
  '$scope', '$routeParams', 'UserService', 'DomainResource',

  function( $scope, params, User, Domain ) {

    $scope.meta = $scope.meta || {};
    $scope.meta.userCreated = false; // ?
    $scope.meta.editMode = !!params.id;

    $scope.domains = Domain.query();
    $scope.user = params.id ? 
      User.get({ id: params.id }) : 
      createUser( User );
    
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