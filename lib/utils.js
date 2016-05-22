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

module.exports = { readJSON, args, listDirectory };