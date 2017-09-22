var appRoot = 'src/'
var outputRoot = 'dist/'
var exportSrvRoot = '/export/'

module.exports = {
  root: appRoot,
  source: appRoot + '**/*.js',
  html: appRoot + '**/*.html',
  scss: appRoot + '**/*.scss',
  fonts: 'node_modules/bootstrap-sass/assets/fonts/bootstrap/*',
  fontAwesome: 'jspm_packages/npm/font-awesome*/**/*',
  fontRaleway: 'src/styles/fonts/Raleway.ttf',
  style: appRoot + 'styles/**/*.css',
  output: outputRoot,
  exportSrv: exportSrvRoot,
  doc: './doc',
  e2eSpecsSrc: 'test/e2e/src/**/*.js',
  e2eSpecsDist: 'test/e2e/dist/'
}
