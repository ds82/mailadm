'use strict';

var 
  pub       = {},
  priv      = {},
  _         = require('underscore'),
  pg        = require('pg'),
  client    = null,
  db        = {},
  maildir   = require('../maildir');

var fnMap = {
  // call the function
  'function': function( val ) { return val.call({}) },
  // assume its an array
  'object': function( val ) { return arr( val )() },
  // just escape the string
  'string': function( val ) { return escapeStrig( val ) },
  'boolean': function( val ) { return val },
  'undefined': function( val ) { return '\'\'' }
};

var md5 = function( str ) {
  return function() {
    return 'md5(\''+str+'\')';
  };
};

var arr = function( ax ) {
  console.log('arr called with',ax);
  return function() {
    return '\'{"' + ax.join('", "') + '"}\'';
  };
};

function escapeStrig( str ) {
  return '\'' + str + '\'';
}

function mkValue( val, map ) {
  
  map = map || fnMap;
  var type = typeof( val );
  return map[type]( val );
}

function mkSet( field, value, isLast ) {
  
  var s = field + ' = ' + mkValue( value );
  if ( !isLast ) s += ', ';
  return s;
}

function mkValueArray( values, keys ) {

  console.log('mkValueArray', values, keys );
  var ax = [], remove = [];
  for( var i = 0; i < keys.length; ++i ) {
    var key = keys[i];
    if ( values[key] ) {
      ax.push( values[key] );
    } else {
      remove.push( key );
      console.log( '# WARNING, cannot find value for key - the key will be removed!', key );
    }
  }

  // remove keys that were not found
  for( var i = 0; i < remove.length; ++i ) {
    var ind = keys.indexOf( remove[i] );
    if ( ind > -1 )
      keys.splice( ind, 1 );
  }

  return ax;
}

//
// TODO 
// + what if cond is custom where string
// 
function mkWhere( cond ) {

  if ( Object.keys( cond ).length === 0 ) return '';
  
  var q = ' WHERE ';
  for ( var k in cond ) {
    q += k + ' = ' + mkValue( cond[k] ) + ' AND ';
  }
  q = q.substr( 0, q.length - 5 );
  return q;
}


db.fetchArray = function( q, cb ) {
  console.log('fetchArray', q );
  client.query(
    q,
    function( err, result ) {
      
      result = result || [];

      if ( err ) console.log('ERROR', err );
      cb( err, result.rows );
  });
};

db.fetch = function( table, fields, order, where, cb ) {

  var f = fields.join(', '),
    q = 'SELECT '+ f +' FROM '+ table;
    
  q += mkWhere( where );
  q += ' ORDER BY ' + order;

  //console.log('q', q );

  return db.fetchArray( q, cb );
};


db.insert = function( table, fields, values, check, cb ) {

  var f = '(' + fields.join(',') + ')',
    v = '(';

  for ( var i = 0; i < values.length; ++i ) {

    v += mkValue( values[i] );
    if ( i < values.length - 1 ) v += ', ';
  }
  v += ')';


  var q = 'INSERT INTO ' + table + ' ' + f + ' VALUES ' + v;
  
  console.log('try to execute query', q );
  client.query( q, cb );
};

db.update = function( table, fields, values, where, val, cb ) {

  var q = 'UPDATE ' + table + ' SET ';
  for( var i = 0; i < fields.length; ++i ) {
    q += mkSet( fields[i], values[i], i+1 === fields.length );
  }
  q += ' WHERE ' + where + ' = ' + mkValue( val );
  console.log('try to execute query', q );
  client.query( q, cb );
};

db.delete = function( table, where, val, cb ) {
  var q = 'DELETE FROM ' + table + ' WHERE ' + where + ' = ' + escapeStrig( val );
  console.log('try to execute query', q );
  client.query( q, cb );
};

//
// DOMAINS
//

pub.domains = {};
pub.domains.query = function( cb ) {
  db.fetch( 'domains', ['domain', 'parent'], 'parent,domain', {}, cb );
};
pub.domains.save = function( data, cb ) {

  if ( data._update )
    pub.domains.update( data, cb );
  else 
    pub.domains.add( data, cb );
};
pub.domains.add = function( data, cb ) {

  db.insert('domains', ['domain','parent'], [data.domain,data.parent], false, cb );
};
pub.domains.update = function( data, cb ) {
  
  var domain = data._id || data.domain,
    keys = ['domain','parent'],
    vals = mkValueArray( data, keys );

  db.update('domains', keys, vals, 'domain', domain, cb );
};
pub.domains.delete = function( domain, cb ) {
  db.delete( 'domains', 'domain', domain, cb );
};

//
// USER
//

priv.user = {};
priv.user.fields = {};

priv.user.fields.query = ['email','alias', 'domain', 'maildir','enabled','is_admin','domains','password'];
priv.user.fields.nopass = _.filter( priv.user.fields.query, function( f ) { return f !== 'password' });

pub.user = {};
pub.user.query = function( cb ) {
  
  db.fetch(
    'users',
    priv.user.fields.nopass,
    'email',
    {},
    function( err, res ) {
      for( var i = 0, ii = res.length; i < ii; ++i ) {
        if ( res[i].maildir ) {
          res[i].maildirCheck = {};
          res[i].maildirCheck.exists = maildir.dirExists( res[i].maildir );
          res[i].maildirCheck.isMaildir = maildir.isMaildir( res[i].maildir );
        }
      }
      cb( err, res );
  });
};

pub.user.get = function( id, cb ) {
  db.fetch('users', priv.user.fields.nopass, 'email', { email: id }, cb );
};

pub.user.save = function ( user, cb ) {

  var fields = _.extend([], priv.user.fields.nopass);
  if ( user._setpw ) {
    fields = _.extend([], priv.user.fields.query);
    user.password = md5( user.plaintext1 );
  }
  
  // fix up user maildir
  user.maildir = user.domain + '/' + user.email + '/';

  var values = mkValueArray( user, fields );

  if ( user._update ) {

    db.update(
      'users',
      fields,
      values,
      'email',
      user._id,
      cb
    );

  } else {
    
    maildir.mkMaildir( user.maildir );
    db.insert(
      'users',
      fields,
      values,
      false,
      cb
    );
  }
};
pub.user.delete = function( id, cb ) {
  db.delete( 'users', 'email', id, cb );
};

pub.user.auth = function( user, password, cb ) {
  
  db.fetch('users', priv.user.fields.query, 'email', {
    'email': user,
    'password': md5( password )
  }, function( err, res ) {

    var user = {};
    console.log('user.auth', err, res );

    if ( res.length && res.length === 1 ) {
      
      user = res.shift();
      // remove password form result
      user.password = '';
      
      cb( null, user );

    } else {
      cb( null, false );
    }
  });
};

//
// ADDRESS
//

priv.address = {};
priv.address.fields = {};

priv.address.fields.query = ['source', 'destination', 'enable_greylisting'];

pub.address = {};
pub.address.query = function( cb ) {
  db.fetch('forward', priv.address.fields.query, 'source', {}, cb );
};

pub.address.save = function( data, cb ) {

  if ( data._update ) {

    db.update(
      'forward',
      priv.address.fields.query,
      mkValueArray( data, priv.address.fields.query ),
      'source',
      data._id,
      cb
    );

  } else
    db.insert(
      'forward',
      priv.address.fields.query,
      mkValueArray( data, priv.address.fields.query ),
      false,
      cb
    );
};

pub.address.delete = function( id, cb ) {

  db.delete('forward', 'source', id, cb );
};



var connect = function( auth ) {
  
  client = new pg.Client( auth );
  client.connect(function ( res ) {
    console.log('connected to pg');
  });
  return pub;
};

module.exports = connect;