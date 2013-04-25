require.config({
	paths: {
		jquery: '../components/jquery/jquery',
		bootstrap: '../components/bootstrap',
		ang: '../components/angular-bootstrap'
	},
	shim: {
		'bootstrap': {
			deps: ['jquery'],
			exports: 'jquery'
		},
		'angular/angular': {
			deps: ['jquery'],
			exports: 'angular'
		},
		'bootstrap/popover': ['bootstrap/tooltip']
	}
});

require(['app', 'jquery', 'ang', 'bootstrap'], function ( app, $, angular ) {
	'use strict';

});