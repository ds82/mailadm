'use strict';
var config = require('../config.json');
var Sequelize = require('sequelize'),
    sequelize = new Sequelize( config.db.db, config.db.user, config.db.password, {
      host: config.db.host,
      dialect: 'postgres',
      schema: 'public',
      define: {
        freezeTableName: true
      }
    });

var crypto = require('crypto');


var sequelDb = {};
sequelDb._model = {};
sequelDb._views = {};
sequelDb._q = Sequelize.Promise;
sequelDb._collection = {};
sequelDb.sequel = sequelize;
sequelDb.clazz = Sequelize;

sequelDb._model.users = sequelize.define('users', {
  email: { type: Sequelize.STRING(80), primaryKey: true },
  password: Sequelize.STRING(32),
  enabled: Sequelize.BOOLEAN,
  is_admin: Sequelize.BOOLEAN,
  access: Sequelize.ARRAY(Sequelize.STRING(200))
}, {
  tableName: 'users',
  createdAt: false,
  updatedAt: false,
  freezeTableName: true,
  //schema: 'public',
  
 instanceMethods: {
  auth: function( password ) {
    var hash = crypto.createHash('md5').update( password ).digest('hex');
    return ( password === hash );
  }
 }
});

sequelDb._model.forward = sequelize.define('forward', {
  source:             { type: Sequelize.STRING(80), primaryKey: true },
  destination:        Sequelize.ARRAY(Sequelize.STRING(80)),
  enable_greylisting: Sequelize.BOOLEAN,
  enable_policyd:     Sequelize.BOOLEAN,
}, {
  tableName: 'forward',
  createdAt: false,
  updatedAt: false,
  freezeTableName: true,
  //schema: 'public',
  
 instanceMethods: {
 }
});

var extensions = {};
['user', 'address'].forEach(function( module ) {
  extensions[module] = require( './' + module ).init( sequelDb );
});

// sequelDb._model.users.findAll().then(function( users ) {
//  console.log( JSON.stringify( users ));
// });

// sequelDb._model.forward.findAll().then(function( data ) {
//  console.log( JSON.stringify( data ));
// });

// sequelDb._model.forward.find('mail@dennis.io').then(function( data ) {
//  console.log( JSON.stringify( data ));
// });

// OLD, WITHOUT ORM MAPPER
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
  'function': function( val ) { return val.call({}); },
  // assume its an array
  'object': function( val ) { return arr( val )(); },
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
  //console.log('arr called with',ax);
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

  var ax = [], remove = [],
      localKeys = keys.slice( 0 );

  //console.log('mkValueArray', values, keys, localKeys );

  for( var i = 0; i < localKeys.length; ++i ) {
    var key = localKeys[i];
    if ( key in values ) {
      ax.push( values[key] );
    } else {
      remove.push( key );
      //console.log( '# WARNING, cannot find value for key - the key will be removed!', key );
    }
  }

  // remove localKeys that were not found
  for( var i = 0; i < remove.length; ++i ) {
    var ind = localKeys.indexOf( remove[i] );
    if ( ind > -1 )
      localKeys.splice( ind, 1 );
  }

  var result = {
    values: ax,
    keys: localKeys
  };

  //console.log('mkValueArray', values, localKeys, result );
  return result;
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

function updateOrInsert( update, insert, data, cb ) {
  if ( data._update ) {
    return update( data, cb );

  } else {
    return insert( data, cb );
  }
};


db.fetchArray = function( q, cb ) {
  //console.log('fetchArray', q );
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

  //console.log('try to execute query', q );
  client.query( q, cb );
};

db.update = function( table, fields, values, where, val, cb ) {

  var q = 'UPDATE ' + table + ' SET ';
  for( var i = 0; i < fields.length; ++i ) {
    q += mkSet( fields[i], values[i], i+1 === fields.length );
  }
  q += ' WHERE ' + where + ' = ' + mkValue( val );
  //console.log('try to execute query', q );
  client.query( q, cb );
};

db.delete = function( table, where, val, cb ) {
  var q = 'DELETE FROM ' + table + ' WHERE ' + where + ' = ' + escapeStrig( val );
  //console.log('try to execute query', q );
  client.query( q, cb );
};

//
// DOMAINS
//

pub.domains = {};
pub.domains.query = function( cb ) {
  db.fetch('domains',
      ['domain', 'parent'],
      'domain,parent',
      {},
      function( err, all ) {

        var list = {},
            childs = [];

        // mark parents and childs
        for( var i = 0, ii = all.length; i < ii; ++i ) {

          if ( !all[i].parent || all[i].domain === all[i].parent ) {
            all[i].childs = [];
            all[i].isChild = false;
            list[(all[i].domain)] = all[i];

          } else {
            all[i].isChild = true;
            // push to childs AND all
            list[(all[i].domain)] = all[i];
            childs.push( all[i] );
          }
        }

        // push childs to parents
        for( var i = 0, ii = childs.length; i < ii; ++i ) {
          if ( childs[i].parent ) {
            list[(childs[i].parent)].childs.push( childs[i] );
          }
        }

        cb( err, _.values( list ));
      });
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

pub.domains.get = function( id, cb ) {
  db.fetch('domains',
    ['domain', 'parent'],
    'domain,parent',
    { domain: id },
    function( err, data ) {
      cb( err, data.pop() );
    }
  );
};


pub.domains.update = function( data, cb ) {

  var domain = data._id || data.domain,
    keys = ['domain','parent'],
    obj = mkValueArray( data, keys );

  db.update('domains', obj.keys, obj.vals, 'domain', domain, cb );
};
pub.domains.delete = function( domain, cb ) {
  db.delete( 'domains', 'domain', domain, cb );
};

//
// USER
//

function addMaildirData( users ) {

  var wasArray = true;
  // ensure array
  if ( ! _.isArray( users )) {
    users = [users];
    wasArray = false;
  }

  for( var i = 0, ii = users.length; i < ii; ++i ) {
    if ( users[i].maildir ) {
      users[i].maildirCheck = {};
      users[i].maildirCheck.exists = maildir.dirExists( users[i].maildir );
      users[i].maildirCheck.isMaildir = maildir.isMaildir( users[i].maildir );
    }
  }
  return ( wasArray ) ? users : users.pop();
}

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

      res = addMaildirData( res );
      cb( err, res );
  });
};

pub.user.get = function( id, cb ) {
  db.fetch('users',
    priv.user.fields.nopass,
    'email',
    { email: id },
    function( err, res ) {
      res = addMaildirData( res );
      cb( err, res.pop() );
    });
};

pub.user.save = function ( user, cb ) {

  var fields = _.extend([], priv.user.fields.nopass);
  if ( user.meta.setpw ) {
    fields = _.extend([], priv.user.fields.query);
    user.password = md5( user.plaintext1 );
  }

  // fix up user maildir
  user.maildir = user.domain + '/' + user.email + '/';

  var obj = mkValueArray( user, fields );

  if ( user._update ) {

    db.update(
      'users',
      obj.keys,
      obj.values,
      'email',
      user._id,
      cb
    );

  } else {

    maildir.mkMaildir( user.maildir, {}, function( err, res ) {
      db.insert(
        'users',
        fields,
        values,
        false,
        cb
      );
    });
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

priv.address.fields.query = ['source', 'destination', 'enable_greylisting', 'enable_policyd'];

pub.address = {};
pub.address.query = function( cb ) {
  db.fetch('forward', priv.address.fields.query, 'source', {}, cb );
};

pub.address.save = function( data, cb ) {

  var obj = mkValueArray( data, priv.address.fields.query );
  if ( data._update ) {
    db.update(
      'forward',
      obj.keys,
      obj.values,
      'source',
      data._id,
      cb
    );

  } else
    db.insert(
      'forward',
      priv.address.fields.query,
      obj.values,
      false,
      cb
    );
};

pub.address.delete = function( id, cb ) {

  db.delete('forward', 'source', id, cb );
};

//
// BLOCKED
//

priv.blocked = {};
priv.blocked.fields = {};
priv.blocked.fields.query = ['destination','domain','action'];

pub.blocked = {};

pub.blocked.query = function( cb ) {
  db.fetch(
    'blocked',
    priv.blocked.fields.query,
    'destination',
    {},
    cb
  );
};



pub.blocked.insert = function( data, cb ) {

  var obj = mkValueArray( data, priv.blocked.fields.query );
  db.insert(
    'blocked',
    obj.keys,
    obj.values,
    false,
    cb
  );
};

pub.blocked.update = function( data, cb ) {

  var obj = mkValueArray( data, priv.blocked.fields.query );
  db.update(
    'blocked',
    obj.keys,
    obj.values,
    'destination',
    data._id,
    cb
  );
};

pub.blocked.save = function( data, cb ) {
  return updateOrInsert(
      pub.blocked.update,
      pub.blocked.insert,
      data,
      cb
  );
};

pub.blocked.delete = function( id, cb ) {

  db.delete('blocked', 'destination', id, cb );
};

var connect = function( auth ) {

  client = new pg.Client( auth );
  client.connect(function ( res ) {
    console.log('connected to pg');
  });
  return pub;
};

module.exports.legacy = connect;
module.exports.db = sequelDb;
module.exports.extensions = extensions;
