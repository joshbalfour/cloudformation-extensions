const path = require('path');

const { deepFindPropertyStartingWith, listDirectory } = require('./utils');
const promisify = require("es6-promisify");

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
			let extension = promisify(require(filename));
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

function parseStatement(statement){
	let extensionName = Object.keys(statement)[0].split('::')[1];
	let args = statement[Object.keys(statement)[0]];
	return {
		extensionName,
		args
	};
}

function processStatement(statement, extensions, context){
	
	return new Promise(function (fulfill, reject){
		// rewrite this when we get Object spread
		let processedStatement = {};
		for (let i in statement){
			processedStatement[i] = statement[i];
		}

		let cfnexStatement = processedStatement.parentObject[processedStatement.key];
		let parsedStatement = parseStatement(cfnexStatement);

		let possibleExtensions = extensions.filter(function(extension){
			return extension.name == parsedStatement.extensionName;
		});

		if (possibleExtensions.length === 0){
			reject(new Error(`Extension "${parsedStatement.extensionName}" not found`));
		} else {
			try {
				possibleExtensions[0].extension(parsedStatement.args, context).then(function(output){
					parsedStatement.resolved = output;
					console.log('processed statement:', processedStatement);
					fulfill(processedStatement);
				}).catch(reject);
			} catch (e) {
				reject(new Error(`Extension "${parsedStatement.extensionName}" failed`, e));
			}
		}
	});
}

module.exports = { getCfnexStatements, loadExtensions, processStatement };