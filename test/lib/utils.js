const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const assert = chai.assert;

const path = require('path');

describe('Cloudformation Extensions.utils', function(){
	
	let utils;

	const logger = {
		debug: console.log,
		error: console.log
	};

	it('should init fine', function(){
		utils = require('../../lib/utils');
	});

	it('should have the correct methods', function(){
		let props = ['readJSON', 'readFile', 'writeFile', 'listDirectory', 'readConfig'];
		props.forEach(function(prop){
			assert.isDefined(utils[prop]);
			assert.typeOf(utils[prop], 'Function', 'is a function');
		});
	});

	describe('readJSON', function(){
		it('should return the contents of a JSON file if passed a location of one that exists', function(){
			assert.isFulfilled(utils.readJSON(path.resolve(__dirname, 'data', 'validJsonFile.json')));
		});
		it('should error correctly if passed a location of that doesn\'t exist', function(){
			assert.isRejected(utils.readJSON(path.resolve('jkdfsljfsdlk')));
		});
	});

	describe('readFile', function(){
		it('should return the contents of a file if passed a location of one that exists', function(){
			assert.isFulfilled(utils.readFile(path.resolve(__dirname, 'data', 'validJsonFile.json')));
		});
		it('should error correctly if passed a location of that doesn\'t exist', function(){
			assert.isRejected(utils.readFile(path.resolve('jkdfsljfsdlk')));
		});
	});

	describe('writeFile', function(){
		it('should write the contents to a file if passed a location of one that doesn\'t exist', function(){
			assert.isFulfilled(utils.writeFile(path.resolve(__dirname, 'data','newFile.json'),'fjdsklfs'));
		});
		it('should error correctly if passed a location that is not writable', function(){
			assert.isRejected(utils.readFile(path.resolve('/dev/random/jkdfsljfsdlk')));
		});
	});

	describe('listDirectory', function(){
		it('should return the contents of a directory if passed a location of one that exists', function(){
			assert.isFulfilled(utils.listDirectory(path.resolve(__dirname, 'data')));
		});
		it('should error correctly if passed a location of that doesn\'t exist', function(){
			assert.isRejected(utils.listDirectory(path.resolve('jkdfsljfsdlk')));
		});
	});

	describe('readConfig', function(){
		const defaultConfig = {
			extensionsDirectory: 'extensions'
		};
		const testConfig = {
			extensionsDirectory: 'testingvalue'
		};

		it('should return the parsed contents of the .cfnexrc file if passed a folder where one exists', function(){
			const cwd = path.resolve(__dirname, 'data');
			assert.isFulfilled(utils.readConfig({cwd: cwd, logger: logger}));
			assert.eventually.equal(utils.readConfig({cwd: cwd, logger: logger}), testConfig);
		});
		it('should return the default config if passed a folder where a .cfnexrc file does not exist', function(){
			const cwd = path.resolve(__dirname, 'data');
			assert.eventually.equal(utils.readConfig({cwd: cwd, logger: logger}), defaultConfig);
		});
		
	});

});