'use strict';

var $       = require('jquery'),
    ng      = require('angularjs'),
    app     = require('app'),
    routes  = require('./routes'),
    modules = require('./modules'),
    i18n    = require('./i18n');

// $(document).ready(function() {

//   console.log('bootstrapping angular...');
//   var $html = $('html');
//   $html.addClass('ng-app="app"');
//   // @todo make it dynamic
//   angularjs.bootstrap( $html, ['app'] );
// });

module.exports = app;
