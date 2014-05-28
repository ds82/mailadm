var colors     = require('colors');
var argv       = require('optimist').argv;
var gulp       = require('gulp');
var gulpif     = require('gulp-if');
var browserify = require('gulp-browserify');
var rename     = require('gulp-rename');
var less       = require('gulp-less');
var refresh    = require('gulp-livereload');
var uglify     = require('gulp-uglify');

var server     = require('./server/main');

var notify     = require('gulp-notify');
var growl      = require('gulp-notify-growl')();
//var sprite     = require('css-sprite').stream;

var lr         = require('tiny-lr');
var server     = lr();

var build = argv.build || 'common';

//
// REQUIRE OPTIONS
//
var defaultRequire = [
  ['../thirdparty/jquery/dist/jquery', { expose: 'jquery' }],
  ['../thirdparty/angular/angular', { expose: 'angularjs' }],
  ['../thirdparty/underscore/underscore', { expose: 'underscore' }],

  ['../../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io', { expose: 'socketio' }],

  ['./angular/app', { expose: 'app' }],
  ['./config', { expose: 'config' }],
  ['../../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js', { expose: 'socketio-client' }],
];

var browserifyOpts = {
  common: {
    outfile: 'main.js',
    debug: !gulp.env.production,
    require: defaultRequire,
    exclude: []
  }
};

gulp.task('scripts', function() {  
  gulp.run( 'browserify:common' );
});

gulp.task('browserify:common', function() {
  // Single entry point to browserify
  var opts = browserifyOpts.common;
  return gulp.src('./app/scripts/main.js')
      .pipe(rename( opts.outfile ))
      .pipe(browserify( opts ))
      //.pipe(gulpif( !!gulp.env.production, uglify()))
      .on('error', function( err ) {
        console.log( err );
      })
      .pipe(gulp.dest('./app/dist/js/'))
      .pipe(refresh(server));
});

gulp.task('less', function () {
  gulp.src('./app/less/style.less')
    .pipe(less({
      paths: ['./app/less/style.less', './app/thirdparty/bootstrap/less'],
      sourceMap: true,
      sourceMapFilename: 'style.map'
    }))
    .on('error', function( err ) {
      console.log( err );
    })
    .pipe(gulp.dest('./app/style/'))
    .pipe(refresh(server));
});

gulp.task('lr-server', function() {  
    server.listen(35729, function(err) {
        if( err ) return console.log(err);
    });
});

// gulp.task('sprites', function() {
//   gulp.src('./dev/sprites/sprite/*.png')
//     .pipe(sprite({
//       name:      'common.png',
//       style:     'sprite-common.css',
//       cssPath:   '../dist/sprites/',
//       processor: 'css'
//     }))
//     .pipe(gulpif('*.png', gulp.dest('./app/dist/sprites/')))
//     .pipe(gulpif('*.css', gulp.dest('./app/style/')));

//   gulp.src('./dev/sprites/shaftencoder/*.png')
//     .pipe(sprite({
//       name:      'sprite-shaftencoder.png',
//       style:     'sprite-shaftencoder.css',
//       cssPath:   '../dist/sprites/',
//       processor: 'css'
//     }))
//     .pipe(gulpif('*.png', gulp.dest('./app/dist/sprites/')))
//     .pipe(gulpif('*.css', gulp.dest('./app/style/')));

// });

var srv;
gulp.task('server', function() {
  if ( srv ) {
    server.app.close();
  }
  srv = server.app.listen( 9000 );
});



gulp.task('build', function() {
  gulp.run( 'scripts' );
  gulp.run( 'less' );
  //gulp.run( 'sprites' );
});

gulp.task('default', function() {  
    var script = 'browserify:' + build;

    gulp.run('lr-server', script, 'less');
    //gulp.run('sprites');

    gulp.watch(['gulpfile.js', 'app/scripts/**'], function(event) {
      gulp.run( script );
    });

    gulp.watch('app/less/**', function(event) {
      gulp.run('less');
    });

    gulp.watch('app/partials/**').on('change', function(file) {
      refresh( server ).changed( file.path );
    });

    // gulp.watch('server/**/*.js').on('change', function() {
    //   gulp.run( 'server' );
    // });

    // gulp.watch('./dev/sprites/**/*.png', function() {
    //   gulp.run('sprites');
    // });
});