'use strict';

const { readJSON } = require('./lib/utils');
const { parseStatement, loadExtensions, processStatement, parse } = require('./lib/cfnex');

function parseCfnex(cfn, { cwd, logger }){
	
	if (!logger){
		logger = {
			debug: console.log,
			error: console.error,
			fatal: function(){
				console.error(arguments);
				process.exit(1);
			},
			info: console.log,
			ok: console.log
		};
	}

	return loadExtensions({logger})
		.then(function(extensions){
			return parse({
				obj: cfn, 
				context: { cwd, extensions, logger }
			}).then(function(){
				return cfn;
			});
		});
}


module.exports = {
	parse: parseCfnex
};