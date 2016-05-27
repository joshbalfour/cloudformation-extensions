const fs = require('fs');
const path = require('path');
const promisify = require("es6-promisify");

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

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
		});
}

module.exports = { readJSON, readFile, writeFile, listDirectory };