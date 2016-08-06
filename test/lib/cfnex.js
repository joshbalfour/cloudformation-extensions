const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const assert = chai.assert;

describe('Cloudformation Extensions.cfnex', function(){
	
	let cfnex;

	const logger = {
		debug: () => {},
		error: () => {},
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

	describe('parse', () => {
		it('should parse the given object', function(){
			const context = {
				logger: logger,
				cwd: '.',
				config: {
					extensionsDirectory: "extensions"
				}
			};
			const obj = {};
			const parent = {};
			const pKey = 'testing';
			parent[pKey] = obj;
			const args = {
				obj,
				parent,
				pKey,
				context
			};
			assert.isFulfilled(cfnex.parse(args));
		});
		it('should error if given an unparsable object', function(){
			const context = {
				logger: logger,
				cwd: '.',
				config: {
					extensionsDirectory: "extensions"
				}
			};
			const obj = {};
			const parent = {};
			const pKey = '';
			parent['testing'] = obj;
			const args = {
				obj,
				parent,
				pKey,
				context
			};
			assert.isRejected(cfnex.parse(args));
		});
	});

	describe('parseStatement', function(){
		it('should parse the given statement', function(){
			const statement = { 'cfnex::anExtension': ['thing1', 'thing2'] };
			const result = cfnex.parseStatement(statement);
			const expected = {
				extensionName: 'anExtension',
				args: ['thing1', 'thing2']
			};
			assert.deepEqual(result, expected);
		});
		it('should error if given an unparsable statement', function(){
			const statement = { 'cfnexfljfanExtension': ['thing1', 'thing2'] };
			try {
				cfnex.parseStatement(statement);
			} catch (e) {
				assert(e);
			}
		});
	});

});