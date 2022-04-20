'use strict'

const path = require('path')
const resolve = require('resolve')

const cosmiconfigDict = {
  cosmiconfig: require('cosmiconfig').cosmiconfig,
  cosmiconfigSync: require('cosmiconfig').cosmiconfigSync
}

const getExplorerMemoized = opts => {
  const cosmiconfig = cosmiconfigDict['cosmiconfig' + (opts.sync ? 'Sync' : '')]
  const explorer = cosmiconfig('generateApi', {
    cache: opts.cache,
    transform: result => {
      if (result && result.config) {
        if (typeof result.config === 'string') {
          const dir = path.dirname(result.filepath)
          const modulePath = resolve(result.config, { paths: [dir] })
          result.config = require(modulePath)
        }

        if (typeof result.config !== 'object') {
          throw new Error(
            'Config is only allowed to be an object, ' + `but received ${typeof result.config} in "${result.filepath}"`
          )
        }

        delete result.config.$schema
      }
      return result
    }
  })
  return explorer
}

/**
 * @param {Options} opts
 * @return {Explorer}
 */
function getExplorer(opts) {
  // Normalize opts before passing to a memoized function
  opts = { sync: false, cache: false, ...opts }
  return getExplorerMemoized(opts)
}

function mergeOverrides(configResult, filePath) {
  const { config, filepath: configPath } = configResult || {}
  const { overrides, ...options } = config || {}
  if (filePath && overrides) {
    const relativeFilePath = path.relative(path.dirname(configPath), filePath)
    for (const override of overrides) {
      if (pathMatchesGlobs(relativeFilePath, override.files, override.excludeFiles)) {
        Object.assign(options, override.options)
      }
    }
  }

  return options
}

function _resolveConfig(filePath, opts, sync) {
  opts = { useCache: true, ...opts }
  const loadOpts = {
    cache: Boolean(opts.useCache),
    sync: Boolean(sync)
  }
  const { load, search } = getExplorer(loadOpts)

  const arr = [opts.config ? load(opts.config) : search(filePath)]
  return arr[0]

  const unwrapAndMerge = ([result]) => {
    const merged = {
      ...mergeOverrides(result, filePath)
    }

    for (const optionName of ['plugins', 'pluginSearchDirs']) {
      if (Array.isArray(merged[optionName])) {
        merged[optionName] = merged[optionName].map(value =>
          typeof value === 'string' && value.startsWith('.') // relative path
            ? path.resolve(path.dirname(result.filepath), value)
            : value
        )
      }
    }

    if (!result) {
      return null
    }

    // We are not using this option
    delete merged.insertFinalNewline
    return merged
  }

  if (loadOpts.sync) {
    return unwrapAndMerge(arr)
  }

  return Promise.all(arr).then(unwrapAndMerge)
}

const resolveConfig = (filePath, opts) => _resolveConfig(filePath, opts, false)

resolveConfig.sync = (filePath, opts) => _resolveConfig(filePath, opts, true)

const defaultConfig = require('../../default.config')
const getConfigSync = () => {
  const syncConfig = resolveConfig.sync()
  console.log('syncConfig: ', syncConfig)
  return Object.assign({}, defaultConfig, syncConfig)
}

module.exports = { resolveConfig, getConfigSync }
