//
// JS Extensions
//

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

Array.prototype.delete = function( item ) {
	var ind = this.indexOf( item );
	if ( ind > -1 ) return this.remove( ind, ind );
	else return this;
};


// TODO refactor
var $components = '../components/',
	$angdist = $components + 'angular-unstable/';
	//$angdist = '../vendor/angularjs/build/';


require.config({
	baseUrl: 'scripts/',
	paths: {
		components: '../../components',
		jquery: '../components/jquery/jquery',
		twitter: 'twitter',
		_angular: $angdist + 'angular',
		ang: 'angular',
		'angular-resource': $components + 'angular-resource/angular-resource',
		//'angular-resource': $angdist + 'angular-resource',
		//'angular-strap': '../components/angular-strap/dist/angular-strap',
		'socketio-client': '../components/socket.io-client/dist/socket.io.min'
	},
	shim: {
		'twitter': {
			deps: ['jquery'],
			exports: 'jquery'
		},
		'_angular': {
			deps: ['jquery'],
			exports: 'angular'
		},
		'angular-resource': ['_angular'],
		//'angular-strap': ['_angular'],
		'components/bootstrap/popover': ['components/bootstrap/tooltip'],
		'ang/modules': ['ang/app'],
		'socketio-client': {
			exports: 'io'
		}
	}
});

require(['jquery', 'ang/app', 'twitter', 'ang/bootstrap', 'socket'], function ( $, ang ) {
	'use strict';

	return ang;
});