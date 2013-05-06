// TODO refactor
require.config({
	baseUrl: 'scripts/',
	paths: {
		components: '../../components',
		jquery: 'components/jquery/jquery',
		bootstrap: 'bootstrap',
		ang: 'angular',
		'socketio-client': '../components/socket.io-client/dist/socket.io.min'
	},
	shim: {
		'bootstrap': {
			deps: ['jquery'],
			exports: 'jquery'
		},
		'components/angular/angular': {
			deps: ['jquery'],
			exports: 'angular'
		},
		'components/angular-resource/angular-resource': ['components/angular/angular'],
		'bootstrap/popover': ['bootstrap/tooltip'],
		'ang/modules': ['ang/app'],
		'socketio-client': {
			exports: 'io'
		}
	}
});

require(['jquery', 'ang/app', 'bootstrap', 'ang/modules', 'socket'], function ( $, ang ) {
	'use strict';

	return ang;
});