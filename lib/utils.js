const fs = require('fs');
const promisify = require("es6-promisify");

function readFile(filename, enc){
	return new Promise(function (fulfill, reject){
		fs.readFile(filename, enc, function (err, res){
			if (err) reject(err);
			else fulfill(res);
		});
	});
}

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

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

function listDirectory(dirPath){
	return readdir(dirPath)
		.then(function(paths){
			return Promise.all(
				paths.map(path => stat(path))
			);
		})
		.then(function(stats){
			console.log(stats);
		});
}

let args = [... process.argv];
args.shift();
args.shift();

function deepFindPropertyStartingWith(object, startsWith, result, parentObject){
	result = result || [];

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

		result.push({parentObject, key});
	}

	let objKeys = Object.keys(object);

	for(let i = 0; i < objKeys.length; i++){
		if(typeof object[objKeys[i]]=="object"){
			deepFindPropertyStartingWith(object[objKeys[i]], startsWith, result, object);
		}
	}

	return result;
}

module.exports = { readJSON, args, deepFindPropertyStartingWith };