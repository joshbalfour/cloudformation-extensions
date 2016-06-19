const path = require('path');

const { listDirectory } = require('./utils');
const promisify = require("es6-promisify");

function loadExtensions({logger, cwd, config}){
	return Promise.all([
			listDirectory(path.resolve(__dirname, '..', 'extensions'), ['.js']),
			listDirectory(path.resolve(cwd, config.extensionsDirectory), ['.js'])
		])
		.then(function([defaultExtensions, localExtensions]){
			defaultExtensions.push(...localExtensions);
			return Promise.all(
				defaultExtensions.map(filename => loadExtension(filename, {logger}))
			);
		});
}

function loadExtension(filename, {logger}){
	return new Promise(function (fulfill, reject){
		try {
			let extension = promisify(require(filename));
			logger.debug(`Loaded extension ${filename}`);
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

function parse({obj, parent, pKey, context}){
	let m = [];

	if (typeof obj != 'object'){
		return obj;
	}

	if (typeof obj === 'object'){
		for (let i in obj){
			let args = {
				obj: obj[i], 
				parent: obj, 
				pKey: i,
				context
			};
			m.push(modify(args).then(parse));
		}
	}

	return Promise.all(m);
}

function modify({obj, parent, pKey, context}){

	let isCfnexStatement = Object.keys(obj).filter(function(key){ 
		return key.indexOf('cfnex::') === 0; 
	}).length > 0;

	if (isCfnexStatement){
		
		let parsedStatement = parseStatement(obj);

		let possibleExtensions = context.extensions.filter(function(extension){
			return extension.name == parsedStatement.extensionName;
		});

		if (possibleExtensions.length === 0){
			throw new Error(`Extension "${parsedStatement.extensionName}" not found`);
		} else {

			return possibleExtensions[0].extension(parsedStatement.args, context)
				.then(function({output, contextChanges}){
					
					let newContext = {};
					
					for (let i in context){
						newContext[i] = context[i];
					}
					
					for (let i in contextChanges){
						newContext[i] = contextChanges[i];
					}

					parent[pKey] = output;

					return {
						obj: output,
						parent, 
						pKey,
						context: newContext
					};

				});
		}

	} else {
		parent[pKey] = obj;
		return new Promise(function (fulfill, reject){
			fulfill({
				obj, 
				parent, 
				pKey,
				context
			});
		});
	}
}

module.exports = { loadExtensions, parse, parseStatement };