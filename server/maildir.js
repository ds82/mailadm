//
// NODE MODULE TO HANDLE MAILDIR STUFF
//

var path    = require('path'),
    fs      = require('fs'),
    config  = require('./config.json'),
    spawn   = require('child_process').spawn;

var mod = {};
module.exports = mod;

function cmd_exec( cmd, args, cb ) {
  var child = spawn(cmd, args),
      out = '';

  child.stdout.on('data', function ( data ) { 
    out =+ data;
  });
  child.stdout.on('end', function () { 
    cb( null, data ); 
  });
}

mod.dirExists = function( maildir ) {
  var absPath = path.resolve( config.mailhome, maildir );
  return fs.existsSync( absPath );
};

mod.isMaildir = function( maildir ) {
  var mboxPath = path.resolve( config.mailhome, maildir, 'dovecot.index' );
  return mod.dirExists( maildir) && fs.existsSync( mboxPath );
};

mod.mkMaildir = function( maildir, opts, cb ) {

  opts = opts || {};
  opts.force = opts.force || false;

  var absPath = path.resolve( config.mailhome, maildir );
  if ( ! mod.isMaildir( absPath )) {
    cmd_exec( config.maildirmake, [absPath], function( err, res ) {
      cb( err, res )
    });
  }
};