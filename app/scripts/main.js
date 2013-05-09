// TODO refactor
var $components = '../components/',
	$angdist = $components + 'angular/';
	//$angdist = '../vendor/angularjs/build/';


require.config({
	baseUrl: 'scripts/',
	paths: {
		components: '../../components',
		jquery: 'components/jquery/jquery',
		twitter: 'twitter',
		_angular: $angdist + 'angular',
		ang: 'angular',
		'angular-resource': $components + 'angular-resource/angular-resource',
		//'angular-resource': $angdist + 'angular-resource',
		'angular-strap': '../components/angular-strap/dist/angular-strap',
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
		'angular-strap': ['_angular'],
		'twitter/popover': ['twitter/tooltip'],
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