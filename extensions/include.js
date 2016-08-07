const path = require('path')
const promisify = require('es6-promisify')

const { readJSON } = require('../lib/utils')

function include(args, { cwd, logger }) {
	const aargs = [...args]
	const filename = aargs.shift()

	const fn = path.resolve(cwd, filename)
	logger.debug(`including JSON/JS file ${fn}`)
	let ret

	if (path.extname(fn) === '.json') {
		ret = readJSON(fn).then(output => {
			const newCwd = path.resolve(fn, '..')

			return {
				output,
				contextChanges: { cwd: newCwd },
			}
		})
	} else if (path.extname(fn) === '.js') {
		const js = new require(fn) // eslint-disable-line no-new-require, new-cap
		const newCwd = path.resolve(fn, '..')
		if (typeof js === 'function') {
			const file = promisify(js)
			ret = file(aargs).then(output => (
				{
					output,
					contextChanges: { cwd: newCwd },
				}
			))
		} else {
			ret = new Promise(fulfill => {
				fulfill({
					output: js,
					contextChanges: { cwd: newCwd },
				})
			})
		}
	} else {
		ret = new Promise((fulfill, reject) => {
			const err = new Error('Include can only be used for JSON files and JS files which module.export an object')
			reject(err)
		})
	}

	return ret
}

module.exports = include
