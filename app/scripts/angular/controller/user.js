 /**
 * user
 * @author Dennis Sänger, 2013
 */
 var $      = require('jquery'),
     app    = require('app'),
     config = require('config');

function fixupUser( user ) {
  
  var tmp = user.email.split('@');
  user.alias = tmp[0];
  user.domain = tmp[1];
}

function createUser( User ) {

  var user = new User();
  
  user.meta = user.meta || {};
  user.meta.setpw = true;
  user.meta.update = false;
  
  user.enabled = true;
  user.is_admin = false;
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
      user.meta = user.meta || {};
      user.meta.update = true;
      user.meta.setpw = false;

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
'$scope', 'UserResource', 'DomainResource', 'isNew', 'userData', 'domainData',
function( $scope, User, Domain, isNew, userData, domainData ) {

  $scope.meta = $scope.meta || {};
  $scope.meta.isNew = isNew;

  $scope.domains = domainData;
  $scope.user = userData;
  
  $scope.save = function( user ) {

    fixupUser( user );
    user.$save(function( res ) {

      if ( ! user.meta.update ) {
        $scope.data.push( res );
        $scope.meta.savedChanges = 'edit';
      
      } else {
        $scope.meta.savedChanges = 'update';
      }
      $scope.create();
    });
  };

  $scope.change = function( pw ) {
    $scope.user.meta.setpw = !!( pw );
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
