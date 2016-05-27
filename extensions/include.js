const fs = require('fs'),
	  path = require('path'),
	  promisify = require("es6-promisify");

const { readJSON, readFile } = require('../lib/utils');

function include(args, { cwd, logger }){
	let aargs = [... args ];
	let filename = aargs.shift();
	
	let fn = path.resolve(cwd, filename);
	logger.debug(`including JSON/JS file ${fn}`);

	if (path.extname(fn) == '.json'){
		return readJSON(fn).then(function(output){
			let cwd = path.resolve(fn, '..');
			return {
				output,
				contextChanges: { cwd }
			};
		});
	} else if (path.extname(fn) == '.js') {
		let js = new require(fn);
		let cwd = path.resolve(fn, '..');
		if (typeof js === 'function'){
			let file = promisify(js);
			return file(aargs).then(function(output){
				return {
					output: output,
					contextChanges: { cwd }
				};
			});
		} else {
			return new Promise(function(fulfill, reject){
				fulfill({
					output: js,
					contextChanges: { cwd }
				});
			});
		}

	} else {
		throw new Error("Include can only be used for JSON files and JS files which module.export an object");
	}
}

module.exports = include;