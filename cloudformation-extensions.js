'use strict';

const path = require('path');
const { readJSON } = require('./lib/utils');

let args = [... process.argv];
args.shift();
args.shift();

let filePath = path.resolve('.', args[0]);

console.log(`Reading in file: ${filePath}`);

readJSON(filePath)
	.then(function(cfn){
		console.log('Parsed cfn JSON file successfully');
		console.log(`This stack's description is: "${cfn.Description}" `);
		//console.log(cfn);
	})
	.catch(function(err){
		console.error('Error parsing or reading JSON file:',err);
	});