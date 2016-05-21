
const { deepFindPropertyStartingWith } = require('./utils');

function getCfnexStatements(cfn){
	return new Promise(function (fulfill, reject){
		let statements = deepFindPropertyStartingWith(cfn, 'cfnex::');
		fulfill(statements);
	});
}


module.exports = { getCfnexStatements };