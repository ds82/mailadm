'use strict';

var path    = require('path');
var http    = require('http');

var express = require('express');
var Tiny    = require('tiny-di');

// SETUP CONFIG
var config;
try {
  config = require('config/config.json');
} catch (e) {
  console.log('config not found, using fallback config');
  config = require('config/config.dist.json');
}
config.appRoot = path.dirname(__dirname);
config.serverRoot = __dirname;

module.exports = Daemon;

function Daemon() {

  var $injector = new Tiny();
  $injector.bind('$injector').to($injector);
  $injector.setResolver(fileLoader);

  var app = express();
  var server = http.createServer(app);

  $injector
    .bind('config').to(config)
    .bind('app').to(app)
    .bind('server').to(server);

  this.run = run;

  function run() {
    loadModules();
    server.listen(config.server.port, config.server.host);
    console.log('Server started:', config.server.host + ':' + config.server.port);
  }

  function loadModules() {
    var modulePath = path.resolve(config.serverRoot, config.server.modulePath);
    config.modules.forEach(function(submodule) {
      var file = submodule.file || submodule.module;
      var submodulePath = path.resolve(modulePath, file);
      $injector.bind(submodule.module).load(submodulePath);
    });
  }

  function fileLoader(file) {
    var fullPath = path.resolve(__dirname, file);

    try {
      return require(fullPath);
    } catch (e) {

      try {
        // try fallback
        return require(file);

      } catch (e2) {

        console.log('Cannot load required file/module'.red, fullPath);
        console.log(e, e2);
        return false;
      }
    }
  }
}

// STARTED BY COMMAND LINE
if (require.main === module) {
  var daemon = new Daemon();
  daemon.run();
}
