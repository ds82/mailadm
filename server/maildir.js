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
  var child = spawn( cmd, args ),
      out = '';

  child.stdout.on('data', function ( data ) { 
    out += data;
  });
  child.stdout.on('end', function () { 
    cb( null, out ); 
  });
}

mod.getPathByEmail = function( email ) {
  var split = email.split(/@/);
  
  // 2 or something is wrong
  if ( split.length !== 2 ) {
    return false;
  }

  var path = split[1] + '/' + email;
  return path;
};

mod.dirExists = function( maildir ) {
  var absPath = path.resolve( config.mailhome, maildir );
  return fs.existsSync( absPath );
};

mod.isMaildir = function( maildir, cb ) {
  var mboxPath = path.resolve( config.mailhome, maildir, 'new' ),
      exists = mod.dirExists( maildir) && fs.existsSync( mboxPath );
  
  console.log( 'isMaildir', maildir, mboxPath, exists );

  if ( cb ) {
    cb( null, exists );
  }
  return exists;
};

mod.mkMaildir = function( maildir, opts, cb ) {

  opts = opts || {};
  opts.force = opts.force || false;

  var absPath = path.resolve( config.mailhome, maildir );
  if ( ! mod.isMaildir( absPath )) {
    cmd_exec( config.maildirmake, [absPath], function( err, res ) {
      cb( err, res )
    });
  } else {
    cb( null, {});
  }
};