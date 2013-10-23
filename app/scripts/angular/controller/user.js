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

  function createUser( User ) {

    var user = new User();
    user._setpw = true;
    user.enabled = true;
    user.is_admin = false;
    user._update = false;
    return user;
  }

  app.controller('UserController',[
    '$scope',
    'UserResource',
    'DomainResource',

    function( $scope, User, Domain ) {

      $scope.data = User.query();
      $scope.domains = Domain.query();

      $scope.meta = {};
      $scope.meta.userCreated = false;
      
      $scope.meta.show = {};
      $scope.meta.show.userAdd = false;

      $scope.create = function() {
        $scope.user = createUser( User );
      };
      $scope.create();

      $scope.edit = function( user ) {
        
        // tell server to update user instead of inserting
        user._update = true;
        user._setpw = false;

        user._id = user.email;
        $scope.user = user;
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
  '$scope', 'UserResource', 'DomainResource',

  function( $scope, User, Domain ) {

    $scope.meta = $scope.meta || {};
    $scope.meta.savedChanges = false; // ?

    $scope.domains = Domain.query();
    
    $scope.save = function( user ) {

      fixupUser( user );
      user.$save(function( res ) {

        if ( ! user._update ) {
          $scope.data.push( res );
          $scope.meta.savedChanges = 'edit';
        
        } else {
          $scope.meta.savedChanges = 'update';
        }
        $scope.create();
      });
    };

    $scope.change = function( pw ) {
      $scope.user._setpw = !!( pw );
    };

    $scope.setPw = function( set ) {
      if ( ! set ) {
        $scope.user.plaintext2 = '';
        $scope.user.plaintext1 = '';
      }
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