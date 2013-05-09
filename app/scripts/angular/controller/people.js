"use strict";
 /**
 * people
 * @author Dennis Sänger, 2013
 */
define([
	'jquery', 'ang/app', 'config'
], function( $, app, config ) {
 
 	console.log( 'running peopleListController ...' );

 	function addEmail( list ) {
 		list.push({
 			type: '',
 			address: ''
 		});
 		return list;
 	}

 	function removeEmailByIndex( i, list ) {
 		list.splice( i, 1 );
 		return list;
 	}

	app.controller('PeopleListController', [ '$scope', 'people', function( $scope, people ) {
		
		$scope.people = people;
		$scope.dropdown = [
			{text: 'Edit', href: '#/people/edit/{{p._id}}'}
/*
			{text: 'Something else here', click: "$alert('working ngClick!')"},
			{divider: true},
			{text: 'Separated link', href: '#',
				submenu: [
					{text: 'Second level link', href: '#'},
					{text: 'Second level link 2', href: '#'}
				]
			}
*/
		];
	}]);

	app.controller('PeopleEditController', [ '$scope', 'people', 'Address', function( $scope, people, Address ) {

		$scope.searchAddress = '';
		$scope.addEmail = addEmail;
		$scope.removeEmail = removeEmailByIndex;

		$scope.lookupAddressFn = function( q, cb ) {
			console.log('lookupAddressFn', q );
			var list = Address.search({ query: q }, function( res ){ 

				var show = [];
				for( var i = 0; i < list.length; ++i ) {
					show.push(
						list[i].street + ', ' +  
						list[i].zip + ' ' + list[i].city
					);
				}
				cb( show );
			});
			return true;
		};

		if ( !people.email || people.email.length === 0 )
			people.email = addEmail( people.email );

		$scope.people = people;
	}]);

});