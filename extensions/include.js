const fs = require('fs'),
	  path = require('path'),
	  promisify = require("es6-promisify");

const { readJSON, readFile } = require('../lib/utils');

function include(args, { srcFileName }){
	let aargs = [... args ];
	let filename = aargs.shift();
	
	let fn = path.resolve(srcFileName, '..', filename);
	console.log(`including JSON/JS file ${fn}`);

	if (path.extname(fn) == '.json'){
		return readJSON(fn).then(function(output){
			return {
				output,
				contextChanges: { srcFileName: fn }
			};
		});
	} else if (path.extname(fn) == '.js') {
		let file = promisify(new require(fn));
		return file(aargs).then(function(output){
			return {
				output: output,
				contextChanges: { srcFileName: fn }
			};
		});
	} else {
		throw new Error("Include can only be used for JSON files and JS files which module.export an object");
	}
}

module.exports = include;