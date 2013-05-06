// TODO refactor
require.config({
	baseUrl: 'scripts/',
	paths: {
		components: '../../components',
		jquery: 'components/jquery/jquery',
		twitter: 'twitter',
		ang: 'angular',
		'socketio-client': '../components/socket.io-client/dist/socket.io.min'
	},
	shim: {
		'twitter': {
			deps: ['jquery'],
			exports: 'jquery'
		},
		'components/angular/angular': {
			deps: ['jquery'],
			exports: 'angular'
		},
		'components/angular-resource/angular-resource': ['components/angular/angular'],
		'twitter/popover': ['twitter/tooltip'],
		'ang/modules': ['ang/app'],
		'socketio-client': {
			exports: 'io'
		}
	}
});

require(['jquery', 'ang/app', 'twitter', 'ang/modules', 'socket'], function ( $, ang ) {
	'use strict';

	return ang;
});