'use strict';

var gulp = require('gulp');

gulp.task('dist:fonts', function() {
  gulp
    .src([
      './node_modules/flatui-pro/fonts/**/*',
      './node_modules/font-awesome/fonts/**/*'
    ])
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('dist:flatui-js', function() {
  gulp.src(['./node_modules/flatui-pro/dist/js/flat-ui-pro.js'])
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('dist:module-partials', function() {
  gulp.src(['./app/modules/**/*.html'])
    .pipe(gulp.dest('dist/modules/'));
});

gulp.task('dist', [
  'dist:module-partials',
  'dist:fonts',
  'dist:flatui-js'
], function() {

});
