//
// JS Extensions
//

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

Array.prototype.delete = function( item ) {
  var ind = this.indexOf( item );
  if ( ind > -1 ) return this.remove( ind, ind );
  else return this;
};


require.config({
  baseUrl: 'scripts/',
  paths: {
    '3rd':              '../thirdparty',
    jquery:             '../thirdparty/jquery/jquery',
    angularjs:          '../thirdparty/angular-dev/angular',
    app:                'angular/app',
    bs:                 '../thirdparty/bootstrap/js/',
    ng:                 '../thirdparty/angular-dev/',
    'socketio-client':  '../thirdparty/socket.io-client/dist/socket.io.min',
  },
  shim: {
    'bootstrap': {
      deps: ['jquery'],
      exports: 'jquery'
    },
    'angularjs': {
      deps: ['jquery'],
      exports: 'angular'
    },
    modules: {
      deps: ['app']
    },
    'angular-extensions': {
      deps: ['angularjs']
    },
    'socketio-client': {
      exports: 'io'
    }
  }
});

require(['jquery', 'angular/rdy', 'bootstrap'], function ( $, rdy ) {
  'use strict';

  return rdy;
});