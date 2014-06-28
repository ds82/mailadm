'use strict';
 /**
 * address
 * @author Dennis Sänger, 2013
 */
var $   = require('jquery'),
    $u  = require('underscore'),
    app = require('app');

function makeSource( alias, domain ) {
  return alias + '@' + domain;
}

function makeDestination( addr ) {
  console.log('makeDestination', addr );
  if ( addr.destinationsAsList ) {
    return addr.destinationsAsList.join(' ');
  }
  return '';
};

function splitSource( address ) {
  var tmp = address.source.split('@');
  address.alias = tmp[0];
  address.domain = tmp[1];
  return address;
}

function prepareEdit( addr ) {
  
  addr.meta = addr.meta || {};

  addr.meta.update = true;
  addr.meta.id = addr.source;
  addr = splitSource( addr );
  addr.destinationsAsList = addr.destination.split(/[\s]/);
  return addr;
}


app.filter('splitBySpace', function() {
  return function( input ) {
    input = input || [];
    return input.split( ' ' ).join(', ');
  }
});


app.directive('setFocus', [function() {
  return {
    restrict: 'A',
    scope: {
      setFocus: '='
    },
    link: function( $scope, $element, $attrs ) {
      
      $scope.setFocus = function() {
        $element.focus();
      };
    }
  };
}]);

app.directive('onSpace', [function() {
  return {
    restrict: 'A',
    scope: false,
    require: 'ngModel',
    link: function( $scope, $element, $attrs, ngModelCtrl ) {
      var fn = $scope.$eval( $attrs.onSpace );

      //console.log( 'onSpace', fn );

      $element.on('keydown', function( ev ) {
        if ( ev.keyCode === 32 ) {
          //console.log( 'SPACE!', $scope[$attrs.onSpace], $scope, $attrs.onSpace );
          $scope.$apply(function() {
            fn( ngModelCtrl.$viewValue );
          });
        }
      });
    }
  };
}]);

app.controller('AddressListCtrl', ['AddressResource', '$scope', 'data',
function( Address, $scope, data ) {
  $scope.list = data;

  $scope.meta ={};
  $scope.meta.isLoading = false;
  $scope.meta.search = '';
  $scope.meta.filter = {};

  function makeQuery() {
    var query = '',
        filter = $scope.meta.filter || {},
        search = $scope.meta.search || '';

    for( var k in filter ) {
      var list = filter[k] || [];
      for( var i = 0, ii = list.length; i < ii; ++i ) {
        query += '#' + k + '=' + list[i] + ' ';
      }
    }

    return query + search;
  }

  var search = function() {

    $scope.meta.isLoading = true;
    var query = makeQuery();
    $scope.list = [];

    console.log( 'search...', query );
    Address.query({ search: query }, function( data ) {
      $scope.list = data;
      $scope.meta.isLoading = false;
    });
  };

  $scope.search = function( what ) {
    var foundFilter = what.match(/#/);
    
    if ( foundFilter ) {
      console.log( 'found filter, not searching ..', foundFilter );
    
    } else {
      $u.debounce( search, 500 )();
    }
    //$u.debounce( search, 500 )();
  };

  $scope.filter = {};
  $scope.filter.add = function( key ) {
    var lastChar = $scope.meta.search[$scope.meta.search.length];
    if ( $scope.meta.search.length && lastChar && lastChar !== ' ' ) {
      $scope.meta.search += ' ';
    }
    $scope.meta.search += '#' + key + '=';
    $scope.filter.focusSerch();
  };

  var regexp = new RegExp(/#([a-z]+)=([a-zA-Z0-9-_@\.]+)/);
  $scope.filter.check = function( what ) {
    var filter = regexp.exec( what );
    console.log( 'filter.check', what, filter );
    if ( filter ) {
      $scope.meta.filter[( filter[1] )]
          = $scope.meta.filter[( filter[1] )] || [];
      $scope.meta.filter[( filter[1] )].push( filter[2] );
      $scope.meta.search = $scope.meta.search.replace( regexp, '' );

      console.log( 'found filter:', filter, $scope.meta.filter );
      search();
    }
  };

}]);
 
app.controller('AddressEditCtrl', [
  '$scope',
  'address',
  'domains',

  function( $scope, address, domains ) {

    $scope.address = address;
    
    function init() {
      $scope.address.source = $scope.address.source || '';
      $scope.address.destination = $scope.address.destination || [];


      var split = $scope.address.source.split( '@' );
      $scope.address.$alias = split[0];
      $scope.address.$domain = split[1];
    }
    init();

    $scope.$watchCollection( 'address.destination', function( list ) {
      if ( list ) {
        var hasEmpty = $u.contains( list, '' );
        if ( !hasEmpty ) {
          $scope.address.destination.push('');
        }
      }
    });

    $scope.domains = domains;

    $scope.save = function( address ) {
      $scope.address.source = $scope.address.$alias + '@' + $scope.address.$domain;
      address.$save(function( res ) {
        init();
        console.log( 'DONE' );
      }, function( err ) {
        console.log( 'ERR' );
      });
    };

    $scope.destination = {};
    $scope.destination.remove = function( entry ) {
      $scope.address.destination.splice( entry, 1 );
    };

}]);
