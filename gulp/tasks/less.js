'use strict';

var gulp = require('gulp');
var less = require('gulp-less');

gulp.task('less', function() {
  return gulp
    .src('./app/less/style.less')
    .pipe(less({
    }))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('less:watch', function() {
  return gulp.watch(['./app/less/**/*.less'], ['less']);
});
