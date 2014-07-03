/**
 * (c) 2014 Dennis Sänger <mail@dennis.io>
 * License: MIT
*/

"use strict";

var app     = require('app');
var Ladda = require('thirdparty/ladda-bootstrap/dist/ladda');


app.directive('laddaButton', [function() {
  return {
    restrict: 'A',
    scope: false,
    link: function( $scope, $element, $attrs ) {

      $attrs.$set( 'dataStyle', 'zoom-in' );
      $attrs.$set( 'data-spinner-size', '30' );

      $element.toggleClass( 'ladda-button', true )
      var ladda = Ladda.create( $element[0] );
          //.wrapInner('<span class="ladda-label"></span>');
      
      $scope.$watch( $attrs.laddaButton, function( bool ) {
        if ( bool && !ladda.isLoading() ) {
          ladda.start();
        } else {
          ladda.stop();
        }
      });
    }
  };
}]);