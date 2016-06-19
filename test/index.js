const assert = require('chai').assert;

describe('Cloudformation Extensions', function(){

	let cloudformationExtensions;

	it('should init fine', function(){
		cloudformationExtensions = require('../index.js');
	});

	it('should have the correct methods', function(){
		let props = ['parseCfnex'];
		props.forEach(function(prop){
			assert.isDefined(cloudformationExtensions[prop]);
			assert.typeOf(cloudformationExtensions[prop], 'Function', 'is a function');
		});
	});

	describe('parseCfnex', function(){
		let parseCfnex;

		it('should exist', function(){
			assert.isDefined(cloudformationExtensions.parseCfnex);
			parseCfnex = cloudformationExtensions.parseCfnex;
		});

		

	});

});