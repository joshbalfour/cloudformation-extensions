const fs = require('fs');
const path = require('path');
const promisify = require("es6-promisify");

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const defaultConfig = {
	extensionsDirectory: 'extensions'
};

function readJSON(filename){
	return readFile(filename, 'utf8').then(function (res){
		return JSON.parse(res);
	});
}

function listDirectory(dirPath, allowedFileTypes){
	return readdir(dirPath)
		.then(function(paths){
			return paths.map(function(filepath){
				return path.resolve(dirPath, filepath);
			}).filter(function(absPath){
				if (allowedFileTypes){
					return allowedFileTypes.includes(path.extname(absPath));
				} else {
					return true;
				}
			});
		})
		.catch(function(){
			return [];
		});
}

function readConfig({cwd, logger}){
	let dotFilePath = path.resolve(cwd,'.cfnexrc');
	logger.debug(`Reading user config at ${dotFilePath}`);
	return readJSON(dotFilePath)
		.then(function(userConfig){
			// TODO: use Object.assign(newConfig, config, defaultConfig);
			logger.debug(`Read user config ${JSON.stringify(userConfig, 2)}`);
			let config = {};
			for (let i in defaultConfig){
				config[i] = defaultConfig[i];
			}
			for (let i in userConfig){
				logger.debug(`User specified value for property ${i} overrides default config value.`);
				config[i] = userConfig[i];
			}
			logger.debug(`Resulting config is: ${JSON.stringify(config,2)}`);
			return config;
		})
		.catch(function(err){
			logger.debug(`Error reading user config: ${err}, using default config...`);
			return defaultConfig;
		});
}

module.exports = { readJSON, readFile, writeFile, listDirectory, readConfig };