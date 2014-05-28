'use strict';
 /**
 * config
 * @author Dennis Sänger, 2013
 */
 
var mod = {},
host = window.location.host;
mod.host = 'http://' + host.replace(/:[0-9]+/, '\\$&');
mod.cleanHost = 'http://'+host;

console.log( 'config', mod );

module.exports = mod;
