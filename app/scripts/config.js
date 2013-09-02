'use strict';
 /**
 * config
 * @author Dennis Sänger, 2013
 */
define([

], function() {
 
	var Module = {},
      host = window.location.host;
	Module.host = 'http://' + host.replace(/:[0-9]+/, '\\$&');
	Module.cleanHost = 'http://'+host;

  console.log( 'config', Module );

	return Module;
});