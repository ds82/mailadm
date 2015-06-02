'use strict';

var path    = require('path');
var http    = require('http');

var express = require('express');
var Tiny    = require('tiny-di');

var Sequelize  = require('sequelize');

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

  var app = express();
  var server = http.createServer(app);

  $injector
    .bind('config').to(config)
    .bind('app').to(app)
    .bind('server').to(server)
    .ns('ext').to('extensions')
  ;

  this.run = run;

  function run() {
    initDB();
    loadModules();
    server.listen(config.server.port, config.server.host);
    console.log('Server started:', config.server.host + ':' + config.server.port);
  }

  function initDB() {
    var db = new Sequelize(
      config.db.database,
      config.db.user,
      config.db.password,
      {
        host: config.db.host,
        dialect: 'postgres'
      }
    );
    $injector.bind('db').to(db);
  }

  function loadModules() {
    var modulePath = path.resolve(config.serverRoot, config.server.modulePath);
    config.modules.forEach(function(submodule) {
      var file = submodule.file || submodule.module;
      var submodulePath = path.resolve(modulePath, file);
      $injector.bind(submodule.module).load(submodulePath);
    });
  }
}

// STARTED BY COMMAND LINE
if (require.main === module) {
  var daemon = new Daemon();
  daemon.run();
}
