var path = require('path')

exports.base = function (modules) {
  return {
    filename: '',
    filenameRelative: '',
    sourceMaps: true,
    sourceRoot: '',
    moduleRoot: path.resolve('src').replace(/\\/g, '/'),
    moduleIds: false,
    comments: false,
    compact: false,
    code: true,
    presets: [ ['es2015', { loose: true, modules: modules }], 'stage-1' ],
    plugins: [
      'transform-decorators-legacy',
      'transform-runtime'
    ]
  }
}

exports.system = function () {
  var options = exports.base()
  options.plugins.push('transform-es2015-modules-systemjs')
  return options
}
