require.config({
	baseUrl: 'scripts/',
	paths: {
		components: '../../components',
		jquery: 'components/jquery/jquery',
		bootstrap: 'bootstrap',
		ang: 'angular/bootstrap',
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
		'bootstrap/popover': ['bootstrap/tooltip'],
		'angular/modules': ['ang']
	}
});

require(['jquery', 'ang', 'bootstrap', 'angular/modules'], function ( $, ang ) {
	'use strict';

	return ang;
});