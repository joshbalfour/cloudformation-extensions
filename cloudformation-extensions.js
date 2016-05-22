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
		console.log(`Loaded ${extensions.length} extensions`);
		console.log(`Found ${statements.length} cfnex statements to process`);
		
		let context = {
			srcFileName: filePath
		};

		return Promise.all(
			statements.map( statement => processStatement(statement, extensions, context) )
		);

	})
	.then(function(processedStatements){
		processedStatements.forEach(function(processedStatement){
			console.log(processedStatement);
		});
	})
	.catch(function(err){
		console.error('Error:', err);
	});