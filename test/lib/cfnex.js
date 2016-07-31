const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const assert = chai.assert;

describe('Cloudformation Extensions.cfnex', function(){
	
	let cfnex;

	const logger = {
		debug: console.log,
		error: console.log
	};

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

		it('should load the given extensions', function(){
			const context = {
				logger: logger,
				cwd: '.',
				config: {
					extensionsDirectory: "extensions"
				}
			};
			assert.isFulfilled(cfnex.loadExtensions(context));
		});

		it('should error if it can\'t find the given extensions directory', function(){
			const context = {
				logger: logger,
				cwd: '..',
				config: {
					extensionsDirectory: "extensions"
				}
			};
			assert.isRejected(cfnex.loadExtensions(context));
		});
	});

	describe('parse', function(){
		it('should parse the given object', function(){

		});
		it('should error if given an unparsable object', function(){
			
		});
	});

	describe('parseStatement', function(){
		it('should parse the given statement', function(){

		});
		it('should error if given an unparsable statement', function(){
			
		});
	});

});