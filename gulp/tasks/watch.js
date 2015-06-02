'use strict';

var gulp = require('gulp');

gulp.task('watch', [
  'default',
  'dist',
  'browserify:watch',
  'less:watch'
], function() {});
