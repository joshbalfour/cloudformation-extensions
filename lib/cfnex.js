const path = require('path');

const { deepFindPropertyStartingWith, listDirectory } = require('./utils');

function getCfnexStatements(cfn){
	return new Promise(function (fulfill, reject){
		let statements = deepFindPropertyStartingWith(cfn, 'cfnex::');
		fulfill(statements);
	});
}

function loadExtensions(){
	return listDirectory(path.resolve('.','extensions'), ['.js'])
		.then(function(filenames){
			return Promise.all(
				filenames.map(filename => loadExtension(filename))
			);
		});
}

function loadExtension(filename){
	return new Promise(function (fulfill, reject){
		try {
			let extension = require(filename);
			console.log(`Loaded extension ${filename}`);
			fulfill({
				extension,
				name: path.basename(filename, '.js')
			});
		} catch (e) {
			reject(e);
		}
	});
}

function processStatement(statement, extensions){
	
	return new Promise(function (fulfill, reject){
		// rewrite this when we get Object spread
		let processedStatement = {};
		for (let i in statement){
			processedStatement[i] = statement[i];
		}

		let cfnexStatement = processedStatement.parentObject[processedStatement.key];
		console.log(cfnexStatement);

		fulfill(processedStatement);
	});
}

module.exports = { getCfnexStatements, loadExtensions, processStatement };