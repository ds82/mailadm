'use strict';

var path = require('path');

module.exports = Static;

Static.$inject = ['express', 'app', 'config'];
function Static(express, app, config) {

  var appDir = path.join(config.appRoot, 'app');
  var distDir = path.join(config.appRoot, 'dist');

  app.use('/dist', express.static(distDir));
  app.use('/', express.static(appDir));
}
