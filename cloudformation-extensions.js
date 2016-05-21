'use strict';

const path = require('path');
const { readJSON, args } = require('./lib/utils');
const { getCfnexStatements } = require('./lib/cfnex');

let filePath = path.resolve('.', args[0]);

console.log(`Reading in file: ${filePath}`);

readJSON(filePath)
	.then(function(cfn){
		
		console.log('Parsed cfn JSON file successfully');
		console.log(`This stack's description is: "${cfn.Description}"`);
		
		return getCfnexStatements(cfn);

	})
	.then(function(statements){
		console.log(`Found ${statements.length} cfnex statements to process`);
		console.log(statements);
	})
	.catch(function(err){
		console.error('Error:',err);
	});