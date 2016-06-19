const assert = require('chai').assert;

describe('Cloudformation Extensions.extensions.include-file', function(){
	
	let includeFile;

	it('should init fine', function(){
		includeFile = require('../../extensions/include-file');
	});

	it('should be a function', function(){
		assert.isDefined(includeFile);
		assert.typeOf(includeFile, 'Function', 'is a function');
	});

	it('should return a promise or be promisifyable', function(){
		
	});

	it('shouldn\'t log anything to console but should use the logger', function(){
		
	});

	it('should include a file which exists', function(){
		
	});

	it('should error properly when trying to include a file that doesn\'t exist', function(){
		
	});

});