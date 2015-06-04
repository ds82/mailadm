'use strict';

angular.module('mailadm.forward')
  .service('mailadm.forward.listCtrl', List);

List.$inject = ['data'];
function List(data) {
  var vm = this;

  vm.data = data;
}
