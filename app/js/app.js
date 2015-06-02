'use strict';

var pckg = require('../../package.json');

angular.module('app', [
  'ngNewRouter',
  'mailadm.forward'
])
  .constant('APP_NAME', pckg.name)
  .controller('AppCtrl', AppCtrl);

AppCtrl.$inject = ['APP_NAME'];
function AppCtrl(APP_NAME) {
  var vm = this;

  vm.APP_NAME = APP_NAME;
}
