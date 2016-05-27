'use strict';

const { readJSON } = require('./lib/utils');
const { parseStatement, loadExtensions, processStatement, parse } = require('./lib/cfnex');

function parseCfnex(cfn, { cwd }){

	return loadExtensions()
		.then(function(extensions){
			return parse({
				obj: cfn, 
				context: { cwd, extensions }
			}).then(function(){
				return cfn;
			});
		});
}


module.exports = {
	parse: parseCfnex
};