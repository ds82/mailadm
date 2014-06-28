var $u = require('underscore');

module.exports.init = function( db ) {

  var mod    = {};

  var searchKeyMap = {
    _: {
      to: 'source'
    },
    source: {
      column: 'source',
      op: 'like',
      mod: function( value ) {
        return '%' + value + '%';
      }
    }

  };

  function mkWhereEntry( where, key, value ) {
    var entry = searchKeyMap[key];
    console.log( 'mkWhereEntry', key, value );
    if ( entry ) {
      value = ( entry.mod ) ? entry.mod( value ) : value;
      where[entry.column] = {};
      where[entry.column][entry.op] = value;
      console.log( 'mkWhereEntry', entry, value, where );
    }
    return where;
  }

  function queryToWhere( query ) {
    var list = query.split( ' ' ),
        where = {};

    console.log( 'queryToWhere', list );
    for( var i = 0, ii = list.length; i < ii; ++i ) {
      var match = list[i].match(/^#([a-z]+)=([a-z0-9-_@\.]+)$/i);
      console.log( 'try to match', list[i], match );
      
      // special search by op
      if ( match ) {
        console.log( 'search-op:', match );
        mkWhereEntry( where, match[1], match[2] );
      // simple search
      } else {
        list[i] = list[i].trim();
        if ( list[i] && list[i].length ) {
          var key = searchKeyMap._.to;
          mkWhereEntry( where, key, list[i] );
        }
      }
    }

    return where;
  }

  mod.find = function( query ) {
    var where = ( query ) ? queryToWhere( query ) : {};
    console.log( 'address.find', query, where );
    return db._model.forward.findAll({
      where: where
    });
  };

  mod.save = function( address ) {
    address.destination = $u.without( address.destination, '' );
    address.destination = $u.unique( address.destination );

    console.log( 'address.save', address );

    return db._model.forward.update( address, { source: address.source });
  };



  return mod;
};