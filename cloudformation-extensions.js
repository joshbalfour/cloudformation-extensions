'use strict';

const path = require('path');

const { readJSON, args } = require('./lib/utils');
const { parseStatement, loadExtensions, processStatement, parse } = require('./lib/cfnex');

let filePath = path.resolve('.', args[0]);

console.log(`Reading in file: ${filePath}`);

Promise.all([ 
		readJSON(filePath), 
		loadExtensions()
	])
	.then(function([cfn, extensions]){
		console.log('Parsed cfn JSON file successfully');
		console.log(`This stack's description is: "${cfn.Description}"`);
		console.log(`Loaded ${extensions.length} extensions`);

		return parse({
			obj: cfn, 
			context: { srcFileName: filePath, extensions: extensions }
		}).then(function(){
			return cfn;
		});
	})
	.then(function(cfn){
		console.log("Completed.");
	})
	.catch(function(err){
		console.error('Error:', err);
	});