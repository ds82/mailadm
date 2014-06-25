var app = require('app');

app.directive('btnToggle', [function() {
  
  var defaults = {
    css: {
      enabled: 'btn-success',
      disabled: 'btn-danger'
    }
  };
  
  function applyStyle( $element, isEnabled ) {
    $element.toggleClass( defaults.css.enabled, isEnabled );
    $element.toggleClass( defaults.css.disabled, !isEnabled );
  }

  return {
    restrict: 'A',
    require: 'ngModel',
    scope: false,
    link: function( $scope, $element, $attrs, ngModelCtrl ) {
      
      $element.toggleClass( 'btn-toggle', true );

      var boolModel = !!ngModelCtrl.$viewValue;
      applyStyle( $element, boolModel );
      ngModelCtrl.$setViewValue( boolModel );

      ngModelCtrl.$viewChangeListeners.push(function() {
        boolModel = !!ngModelCtrl.$viewValue;
        applyStyle( $element, boolModel );
      });

      $element.on('click', function() {
        $scope.$apply(function() {
          ngModelCtrl.$setViewValue( !ngModelCtrl.$viewValue );
        });
      });
    }
  }
}]);
