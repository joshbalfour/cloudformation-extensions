const fs = require('fs')
const path = require('path')
const promisify = require('es6-promisify')

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const defaultConfig = {
	extensionsDirectory: 'extensions',
}

function readJSON(filename) {
	return readFile(filename, 'utf8').then(res => JSON.parse(res))
}

const listDirectory = (dirPath, allowedFileTypes) => (
	readdir(dirPath)
		.then(paths => (
			paths
				.map(filepath => path.resolve(dirPath, filepath))
				.filter(absPath => (
					allowedFileTypes ? allowedFileTypes.includes(path.extname(absPath)) : true
				))
		))
		.catch(() => [])
)

function readConfig({ cwd, logger }) {
	const dotFilePath = path.resolve(cwd, '.cfnexrc')
	logger.debug(`Reading user config at ${dotFilePath}`)

	return readJSON(dotFilePath)
		.then(userConfig => {
			logger.debug(`Read user config ${JSON.stringify(userConfig, 2)}`)
			const config = {}
			Object.assign(config, defaultConfig, defaultConfig)
			logger.debug(`Resulting config is: ${JSON.stringify(config, 2)}`)

			return config
		})
		.catch(err => {
			logger.debug(`Error reading user config: ${err}, using default config...`)

			return defaultConfig
		})
}

module.exports = { readJSON, readFile, writeFile, listDirectory, readConfig }
