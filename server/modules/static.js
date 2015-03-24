'use strict';

var path    = require('path');
var express = require('express');

module.exports = Static;

Static.$inject = ['app', 'config'];
function Static(app, config) {

  var appDir = path.join(config.appRoot, 'app');
  var distDir = path.join(config.appRoot, 'dist');

  app.use('/dist', express.static(distDir));
  app.use('/', express.static(appDir));
}
