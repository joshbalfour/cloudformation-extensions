const fs = require('fs');
const path = require('path');
const promisify = require("es6-promisify");

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

function readJSON(filename){
	return new Promise(function (fulfill, reject){
		readFile(filename, 'utf8').then(function (res){
			try {
				fulfill(JSON.parse(res));
			} catch (ex) {
				reject(ex);
			}
		}).catch(reject);
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
		});
}

let args = [... process.argv];
args.shift();
args.shift();

function deepFindPropertyStartingWith(object, startsWith, result, parentObject, depth){
	result = result || [];
	depth = depth || 0;

	let keys = Object.keys(object).filter(function(key){ 
		return key.startsWith(startsWith); 
	});
	
	if(keys.length > 0){
		let key;
		for (let i in parentObject){
			if (parentObject[i] == object){
				key = i;
			}
		}

		result.push({parentObject, key, depth});
	}

	let objKeys = Object.keys(object);

	for(let i = 0; i < objKeys.length; i++){
		if(typeof object[objKeys[i]]=="object"){
			deepFindPropertyStartingWith(object[objKeys[i]], startsWith, result, object, depth+1);
		}
	}

	return result;
}

module.exports = { readJSON, args, deepFindPropertyStartingWith, listDirectory };