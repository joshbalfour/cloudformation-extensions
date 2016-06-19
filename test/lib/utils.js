const assert = require('chai').assert;

describe('Cloudformation Extensions.utils', function(){
	
	let utils;

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
		
	});

	describe('readFile', function(){
		
	});

	describe('writeFile', function(){
		
	});

	describe('listDirectory', function(){
		
	});

	describe('readConfig', function(){
		
	});

});