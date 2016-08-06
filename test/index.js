const assert = require('chai').assert,
	  type = require('type-detect'),
	  path = require('path');

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

		it('should return a promise', function(){
			let context = {
				cwd: '.',
				config: {
					extensionsDirectory: 'extensions'
				}
			};
			
			let returned = parseCfnex({}, context);

			assert(type(returned) === 'promise');
		});

		it('should run end to end as intended', function(done){
			let context = {
				cwd: path.resolve(__dirname, '..', 'example'),
				config: {
					extensionsDirectory: '../extensions'
				}
			};

			let cfnexObj = {
				"AWSTemplateFormatVersion" : "2010-09-09",
  				"Description" : "projectname Stack",
  				"Mappings" : {
  					"AWSRegionToAMI": {
  						"cfnex::include" : [ "./amis.js" ]
  					}
  				}
			};

			let expectedCfn = {
				"AWSTemplateFormatVersion" : "2010-09-09",
  				"Description" : "projectname Stack",
  				"Mappings" : {
  					"AWSRegionToAMI": {
						"us-east-1"      : { "AMIID" : "ami-67a3a90d" },
						"us-west-1"      : { "AMIID" : "ami-b7d5a8d7" },
						"us-west-2"      : { "AMIID" : "ami-c7a451a7" },
						"eu-west-1"      : { "AMIID" : "ami-9c9819ef" },
						"eu-central-1"   : { "AMIID" : "ami-9aeb0af5" },
						"ap-northeast-1" : { "AMIID" : "ami-7e4a5b10" },
						"ap-southeast-1" : { "AMIID" : "ami-be63a9dd" },
						"ap-southeast-2" : { "AMIID" : "ami-b8cbe8db" }
  					}
  				}
			};
			
			let returned = parseCfnex(cfnexObj, context);

			returned.then(function(cfn){
				assert.deepEqual(cfn, expectedCfn, 'cfnex generates the expected cfn object');
				done();
			}).catch(function(err){
				throw err;
			});

		});

		it('should error as intended', function(done){
			let context = {
				cwd: path.resolve(__dirname),
				config: {
					extensionsDirectory: '../extensions'
				}
			};

			let cfnexObj = {
				"AWSTemplateFormatVersion" : "2010-09-09",
				"Description" : "projectname Stack",
				"Mappings" : {
					"AWSRegionToAMI": {
						"cfnex::include" : [ "./amis.js" ]
					}
				}
			};

			let returned = parseCfnex(cfnexObj, context);

			returned.then(function(cfn){
				
			}).catch(function(err){
				assert.isDefined(err);
				done();
			});

		});

	});

});