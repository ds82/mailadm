'use strict';

angular.module('app', [])
  .constant('APP_NAME', 'boilerplate')
  .controller('AppCtrl', AppCtrl);

AppCtrl.$inject = ['APP_NAME'];
function AppCtrl(APP_NAME) {
  var vm = this;

  vm.APP_NAME = APP_NAME;
}
