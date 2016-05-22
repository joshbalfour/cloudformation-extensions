const fs = require('fs'),
	  path = require('path'),
	  promisify = require("es6-promisify");

const { readJSON } = require('../lib/utils');

function include([filename], { srcFileName }){
	let fn = path.resolve(srcFileName, '..', filename);
	console.log(`including file ${fn}`);
	return readJSON(fn).then(function(output){
		return {
			output,
			contextChanges: { srcFileName: fn }
		};
	});
}

module.exports = include;