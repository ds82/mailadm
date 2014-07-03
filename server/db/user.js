var $u = require('underscore');

module.exports.init = function( db ) {

  var mod    = {};

  mod.find = function( email ) {
    return db._model.users.findAll({
      where: { email: email }
    });
  };

  mod.auth = function( email, password ) {
 
    return db._model.users.find({
      where: { 
        email: email,
        password: { eq: db.sequel.fn('md5', password ) }}
    });
  };


  return mod;
};
