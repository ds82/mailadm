'use strict';

var fs   = require('fs');
var path = require('path');
var gulp = require('gulp');

var files = fs.readdirSync(path.join(__dirname, 'tasks'));

files
  .filter(function(file) { return !!file.match(/\.js$/); })
  .forEach(function(file) { require('./tasks/' + file); });

gulp.task('default', [
  'browserify:common',
  'browserify:bundle',
  'less'
]);
