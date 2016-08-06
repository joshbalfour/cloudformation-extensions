const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const assert = chai.assert;
const path = require('path');

describe('Cloudformation Extensions.extensions.include', function(){

	let include = require('../../extensions/include');

	const logger = {
		debug: console.log,
		error: console.log
	};

	it('should include a file which exists', function(){
		assert.isFulfilled(include(['include.json'], {cwd: path.resolve('data'), logger: logger}));
	});

	it('should error properly when trying to include a file that doesn\'t exist', function(){
		assert.isRejected(include(['doesntexist.json'], {cwd: path.resolve('data'), logger: logger}));
	});

	it('should error properly when trying to include a file that is not JS or JSON', function(){
		assert.isRejected(include(['include.notjson'], {cwd: path.resolve('data'), logger: logger}));
	});

});