'use strict';

angular.module('mailadm.forward')
  .service('$mailadm.forward', Forward);

Forward.$inject = ['$resource'];
function Forward($resource) {
  return $resource('forward', {
  }, {

  });
}
