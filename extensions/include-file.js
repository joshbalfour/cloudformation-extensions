const fs = require('fs'),
	  path = require('path');

const { readFile } = require('../lib/utils');

function replaceSubs(str){
	if (str.indexOf('<%cfnex') !== -1 && str.indexOf('cfnex%>') !== -1){
		let left = str.split('<%cfnex')[0];
		let middle = str.split('<%cfnex')[1].split('cfnex%>')[0];
		let right = str.split('cfnex%>')[1];
		return { "Fn::Join": ["", [left, middle, right]] };
	}
	return str;
}

function includeFile(args, { cwd, logger }){
	let aargs = [... args ];
	let filename = aargs.shift();
	
	let fn = path.resolve(cwd, filename);
	logger.debug(`including file ${fn}`);

	return readFile(fn, 'utf-8')
		.then(function(fileContents){
			let split = fileContents.split('\n').map(replaceSubs);
			let output = { "Fn::Join": ["\n", split] };
			return {output};
		});
}

module.exports = includeFile;