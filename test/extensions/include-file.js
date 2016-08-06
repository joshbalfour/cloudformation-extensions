const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const assert = chai.assert;

const path = require('path');

describe('Cloudformation Extensions.extensions.include-file', function(){
	
	const includeFile = require('../../extensions/include-file');

	const logger = {
		debug: console.log,
		error: console.log
	};

	it('should include a file which exists', function(){
		assert.isFulfilled(includeFile(['include.json'], {cwd: path.resolve('data'), logger: logger}));
	});

	it('should error properly when trying to include a file that doesn\'t exist', function(){
		assert.isRejected(includeFile(['doesnotexist.json'], {cwd: path.resolve('data'), logger: logger}));
	});

	it('should replace substitution strings where appropriate', function(){
		const result = includeFile(['substring.txt'], {cwd: path.resolve('data'), logger: logger});
		assert.isFulfilled(result);
		assert.eventually.equal(result, 'fdsfsd');
	});

});