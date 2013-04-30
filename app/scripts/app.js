require.config({
	baseUrl: 'scripts/',
	paths: {
		components: '../../components',
		jquery: 'components/jquery/jquery',
		bootstrap: 'bootstrap',
		ang: 'angular'
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
		'ang/modules': ['ang/app']
	}
});

require(['jquery', 'ang/app', 'bootstrap', 'ang/modules'], function ( $, ang ) {
	'use strict';

	return ang;
});