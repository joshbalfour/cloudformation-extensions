'use strict';

const path = require('path');
const { readJSON, args } = require('./lib/utils');
const { getCfnexStatements, loadExtensions, processStatement } = require('./lib/cfnex');

let filePath = path.resolve('.', args[0]);

console.log(`Reading in file: ${filePath}`);

readJSON(filePath)
	.then(function(cfn){
		
		console.log('Parsed cfn JSON file successfully');
		console.log(`This stack's description is: "${cfn.Description}"`);
		
		return Promise.all([ 
			getCfnexStatements(cfn), 
			loadExtensions()
		]);

	})
	.then(function([statements, extensions]){
		console.log(`Found ${statements.length} cfnex statements to process`);

		return Promise.all(
			statements.map( statement => processStatement(statement, extensions) )
		);

	})
	.then(function(processedStatement){
		console.log('Processed statements:', processedStatement);
	})
	.catch(function(err){
		console.error('Error:',err);
	});