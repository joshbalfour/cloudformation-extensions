const path = require('path')

const { listDirectory } = require('./utils')
const promisify = require('es6-promisify')

function loadExtension(filename, { logger }) {
	return new Promise((fulfill, reject) => {
		try {
			const extension = promisify(require(filename)) // eslint-disable-line global-require
			logger.debug(`Loaded extension ${filename}`)
			fulfill({
				extension,
				name: path.basename(filename, '.js'),
			})
		} catch (e) {
			reject(e)
		}
	})
}

function loadExtensions({ logger, cwd, config }) {
	return Promise.all([
		listDirectory(path.resolve(__dirname, '..', 'extensions'), ['.js']),
		listDirectory(path.resolve(cwd, config.extensionsDirectory), ['.js']),
	])
	.then(([defaultExtensions, localExtensions]) => {
		defaultExtensions.push(...localExtensions)

		return Promise.all(
			defaultExtensions.map(filename => loadExtension(filename, { logger }))
		)
	})
}


function parseStatement(statement) {
	const extensionName = Object.keys(statement)[0].split('::')[1]
	const args = statement[Object.keys(statement)[0]]

	return {
		extensionName,
		args,
	}
}


function modify({ obj, parent, pKey, context }) {
	const isCfnexStatement = Object.keys(obj).filter((key) => (
		key.indexOf('cfnex::') === 0
	)).length > 0

	const newParent = parent

	if (isCfnexStatement) {
		const parsedStatement = parseStatement(obj)
		const possibleExtensions = context.extensions.filter((extension) => (
			extension.name === parsedStatement.extensionName
		))

		if (possibleExtensions.length === 0) {
			throw new Error(`Extension "${parsedStatement.extensionName}" not found`)
		} else {
			return possibleExtensions[0].extension(parsedStatement.args, context)
				.then(({ output, contextChanges }) => {
					const newContext = {}
					Object.assign(newContext, context, contextChanges)
					newParent[pKey] = output

					return {
						obj: output,
						parent: newParent,
						pKey,
						context: newContext,
					}
				})
		}
	} else {
		newParent[pKey] = obj

		return new Promise((fulfill) => {
			fulfill({
				obj,
				parent: newParent,
				pKey,
				context,
			})
		})
	}
}

function parse({ obj, context }) {
	let promises = []

	if (typeof obj !== 'object') {
		return obj
	}

	if (typeof obj === 'object') {
		promises = Object.keys(obj)
			.map(pKey => ({
				obj: obj[pKey],
				parent: obj,
				pKey,
				context,
			}))
			.map(args => modify(args).then(parse))
	}

	return Promise.all(promises)
}

module.exports = { loadExtensions, parse, parseStatement }
