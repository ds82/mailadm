'use strict';

var gulp   = require('gulp');
var Brify  = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

gulp.task('browserify:bundle', function() {
  var common = new Brify();
  return common
    .add('./app/bundle')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('browserify:common', function() {
  var common = new Brify();
  return common
    .add('./app/common')
    .bundle()
    .pipe(source('common.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('browserify:watch', function() {
  gulp.watch(['./app/**/*.js'], ['browserify:bundle']);
});
