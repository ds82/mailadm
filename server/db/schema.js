'use strict';
var textSearch = require('mongoose-text-search');

function Schema( goose ) {

	var ObjectId = goose.Schema.ObjectId;

	this.schemes = {};
	this.models = {};

	// not used yet
	this.ensureTextIndex = function() {

		this.models.addresses.ensureIndex(
			{ "$**": "text" },
			{ name: "TextIndex" }
		);
	};

	/* schemes */
	this.schemes.companiesSchema = goose.Schema({
		_id: ObjectId,
		name: { type: String }
	});

	this.schemes.peopleSchema = goose.Schema({

		_id: ObjectId,
		name: {
			surname: { type: String },
			lastname: { type: String }
		},
		tags: [String],
		email: [{
			type: 'String',
			address: 'String'
		}],
		address: [{ type: ObjectId, ref: 'addresses' }]
	});

	this.schemes.addressesSchema = goose.Schema({

		_id: ObjectId,
		type: { type: String },
		street: { type: String },
		zip: { type: String },
		city: { type: String },
		country: { type: String }
	});
	// temporary disabled
	// this.schemes.addressesSchema.plugin( textSearch );

	/* models */
	this.models.addresses		= goose.model( 'addresses', this.schemes.addressesSchema, 'addresses' );
	this.models.companies		= goose.model( 'companies', this.schemes.companiesSchema, 'companies' );
	this.models.people			= goose.model( 'people', this.schemes.peopleSchema, 'people' );

	return this;
}

exports.Schema = Schema;