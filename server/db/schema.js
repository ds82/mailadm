'use strict';

function Schema( goose ) {

	var ObjectId = goose.Schema.ObjectId;

	this.schemes = {};
	this.models = {};


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
		}
	});

	/* models */
	this.models.companies		= goose.model( 'companies', this.schemes.companiesSchema, 'companies' );
	this.models.people			= goose.model( 'people', this.schemes.peopleSchema, 'people' );

	return this;
}

exports.Schema = Schema;