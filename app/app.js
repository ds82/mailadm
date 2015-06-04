'use strict';

var pckg = require('../package.json');

angular.module('app', [
  'ngNewRouter',
  'mailadm.dashboard',
  'mailadm.forward'
])
  .config(Config)
  .constant('APP_NAME', pckg.name)
  .controller('AppCtrl', AppCtrl);

Config.$inject = ['$componentLoaderProvider'];
function Config($componentLoaderProvider) {
  $componentLoaderProvider.setTemplateMapping(function(name) {
    // name == component name
    console.log('$componentLoaderProvider', name);
    return 'modules/' + name + '/' + name + '.html';
  });
}

AppCtrl.$inject = ['$router', 'APP_NAME'];

function AppCtrl($router, APP_NAME) {
  var vm = this;

  $router.config([
    {path: '/', component: 'dashboard'}
  ]);

  vm.APP_NAME = APP_NAME;

}
