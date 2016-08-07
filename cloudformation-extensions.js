const { loadExtensions, parse } = require('./lib/cfnex')

/* eslint-disable no-console */
const defaultLogger = {
	debug: console.log,
	error: console.error,
	fatal: () => {
		console.error(arguments)
		process.exit(1)
	},
	info: console.log,
	ok: console.log,
}
/* eslint-enable no-console */

function parseCfnex(cfn, { cwd, logger, config }) {
	if (!logger) {
		logger = defaultLogger // eslint-disable-line no-param-reassign
	}

	return loadExtensions({ cwd, logger, config })
		.then(extensions =>
			parse({
				obj: cfn,
				context: { cwd, extensions, logger, config },
			})
		)
		.then(() => cfn)
}


module.exports = { parseCfnex }
