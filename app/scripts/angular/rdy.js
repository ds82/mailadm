define([
  'jquery',
  'angularjs',
  'app',
  'angular/routes',
  'angular/modules',
], function( $, angularjs, app ) {
  'use strict';

  $(document).ready(function() {

    console.log('bootstrapping angular...');
    var $html = $('html');
    $html.addClass('ng-app="app"');
    // @todo make it dynamic
    angularjs.bootstrap( $html, ['app'] );
  });

  return app;
});
