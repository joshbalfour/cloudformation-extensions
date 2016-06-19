const assert = require('chai').assert;

describe('Cloudformation Extensions.extensions.include', function(){
	
	let include;

	it('should init fine', function(){
		include = require('../../extensions/include');
	});

	it('should be a function', function(){
		assert.isDefined(include);
		assert.typeOf(include, 'Function', 'is a function');
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