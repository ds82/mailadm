'use strict';

var sequelize = require('sequelize');

module.exports = Forward;

Forward.$inject = ['db'];
function Forward(db) {

  if (!(this instanceof Forward)) {
    return new Forward(db);
  }

  var $model = db.define('forward', {
    source: {
      type: sequelize.STRING(80),
      unique: true,
      primaryKey: true
    },
    destination: sequelize.ARRAY(sequelize.TEXT),
    enable_greylisting: sequelize.BOOLEAN,
    enable_policyd: sequelize.BOOLEAN
  }, {
    freezeTableName: true,
    tableName: 'forward',
    timestamps: false,
  });

  var self = this;

  self.query = query;
  self.$model = $model;

  function query() {
    return $model.findAll({});
  }

}
