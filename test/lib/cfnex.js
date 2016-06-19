const assert = require('chai').assert;

describe('Cloudformation Extensions.cfnex', function(){
	
	let cfnex;

	it('should init fine', function(){
		cfnex = require('../../lib/cfnex');
	});

	it('should have the correct methods', function(){
		let props = ['loadExtensions', 'parse', 'parseStatement'];
		props.forEach(function(prop){
			assert.isDefined(cfnex[prop]);
			assert.typeOf(cfnex[prop], 'Function', 'is a function');
		});
	});

	describe('loadExtensions', function(){
		
	});

	describe('parse', function(){
		
	});

	describe('parseStatement', function(){
		
	});

});