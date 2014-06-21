'use strict';

var express       = require('express'),
  app             = express(),
  server          = require('http').createServer(app),
  io              = require('socket.io').listen(server),
  config          = require('./config.json'),
  db              = require('./db/db')( config.pg_connect ),
  maildir         = require('./maildir'),
  passport        = require('passport'),
  LocalStrategy   = require('passport-local').Strategy;

var allowCrossDomain = function( req, res, next ) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  if ( next ) {
    next();
  }
};

app.configure(function() {
  app.use( express.static(__dirname + '/../app') );
  app.use( allowCrossDomain );
  app.use( express.bodyParser() );
  app.use( express.cookieParser() );
  app.use( express.methodOverride() );
  app.use( express.session({ secret: 'keyboard cat' }) );
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use( passport.initialize() );
  app.use( passport.session() );
});

app.options('*', function(req, res) {
  res.send(200);
  res.end();
});

//
// PASSPORT TESTING
//

passport.serializeUser( function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(id, done) {

  //console.log( '**** deserializeUser', id );
  db.user.get( id, function( err, result ) {
    if ( err ) done( err, null );
    else {
      done( null, result );
    }
  })
});


passport.use(new LocalStrategy(

  function( username, password, done ) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      console.log( 'try to authenticate ...', username, password );
      db.user.auth( username, password, function( err, result ) {
        console.log( 'auth result', err, result );
        done( null, result );
      });
    });
  }
));

function ensureAuthenticated( req, res, next ) {

  // disable auth
  // return next();
  if ( ! req.isAuthenticated() ) {
    console.log( 'isAuthenticated', req.originalUrl, req.isAuthenticated() );
  }

  if ( req.isAuthenticated() ) {
    return next();
  } else {
    res.send( 401 );
    res.end();
    return;
  }
}

//
// DOMAIN
//
app.get('/domain',
  ensureAuthenticated,
  function( req, res ) {

    db.domains.query( function( err, data ) {
      if ( err ) res.send( err );
      else res.send( data );
    });
});

app.get('/domain/:id',
  ensureAuthenticated,
  function( req, res ) {

  db.domains.get( req.params.id, function( err, data ) {
    res.send( data );
  });
});


app.post('/domain/:id',
  ensureAuthenticated,
  function( req, res ) {

  db.domains.save( req.body, function( err, data ) {
    res.send( req.body );
  });
});

app.delete('/domain/:id',
  ensureAuthenticated,
  function( req, res ) {
  db.domains.delete( req.params.id, function( err, data ) {
    res.send( data );
  });
});

//
// USER
//
app.post('/login',
  passport.authenticate('local', {}),
  function( req, res ) {
    res.send( req.user );
});

app.get('/user',
  ensureAuthenticated,
  function( req, res ) {
    db.user.query( function( err, data ) {
      res.send( data );
    });
});

app.get('/user/:id',
  ensureAuthenticated,
  function( req, res ) {
    db.user.get( req.params.id, function( err, data ) {
      res.send( data );
    });
});


app.post('/user/:id?',
  ensureAuthenticated,
  function( req, res ) {

    console.log('post,user', req.body );
    db.user.save( req.body, function( err, data ) {
      res.send( req.body );
    });
});

app.delete('/user/:id',
  ensureAuthenticated,
  function( req, res ) {

    db.user.delete( req.params.id, function( err, data ) {
      res.send( data );
    });
});


//
// ADDRESS
//
app.get('/address',
  ensureAuthenticated,
  function( req, res ) {

    db.address.query( function( err, data ) {
      res.send( data );
    });
});

app.post('/address/:id?',

  ensureAuthenticated,
  function( req, res ) {

    db.address.save( req.body, function( err, data ) {
      res.send( req.body );
    });
});

app.delete('/address/:id',
  ensureAuthenticated,
  function( req, res ) {
    db.address.delete( req.params.id, function( err, data ) {
      res.send( data );
    });
});

//
// BLOCKED
//

app.get('/blocked', ensureAuthenticated, function( req, res ) {
  db.blocked.query( function( err, data ) {
    res.send( data );
  });
});

app.post('/blocked/:id?', ensureAuthenticated, function( req, res ) {

    db.blocked.save( req.body, function( err, data ) {
      res.send( req.body );
    });
});

app.delete('/blocked/:id', ensureAuthenticated,
  function( req, res ) {
    db.blocked.delete( req.params.id, function( err, data ) {
      res.send( data );
    });
});

//
// MAILDIR
//

// checks if a maildir exists
app.get('/maildir/:email', ensureAuthenticated, function( req, res ) {

  var maildirPath = maildir.getPathByEmail( req.params.email );

  if ( ! maildirPath ) {
    res.send( 400 );

  } else {
    maildir.isMaildir( maildirPath, function( err, data ) {
      res.send( data );
    });
  }
});

//
// SOCKET
//
io.sockets.on('connection', function (socket) {
  socket.emit('connected', { hello: 'world' });
});

exports = module.exports = server;
// delegates user() function
exports.use = function() {
  app.use.apply(app, arguments);
};

if ( require.main === module ) {
  var port   = process.env.PORT   || 9000,
      listen = process.env.LISTEN || '0.0.0.0';

  app.listen( port, listen, function() {
    console.log( '== listen on', listen, port );
  });
}

exports.app = app;
