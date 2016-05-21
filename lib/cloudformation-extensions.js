'use strict';

const path = require('path');
const { readJSON } = require('./misc/utils');

let args = [... process.argv];
args.shift();
args.shift();

let filePath = path.resolve('.', args[0]);

readJSON(filePath)
	.then(function(cfn){
		console.log(cfn);
	})
	.catch(function(err){
		console.error(err);
	});

console.log(filePath);