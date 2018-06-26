import gulp from 'gulp'
import merge from 'merge-stream'
import changedInPlace from 'gulp-changed-in-place'
import project from '../aurelia.json'

export default function prepareFonts () {
  const source = 'node_modules/@fortawesome/fontawesome-free'

  const taskFaCss = gulp.src(`${source}/css/all.css`)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(gulp.dest(`${project.platform.output}/css`))

  const taskFaFonts = gulp.src(`${source}/webfonts/*`)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(gulp.dest(`${project.platform.output}/webfonts`))

  const taskBootstrapFonts = gulp.src('node_modules/bootstrap-sass/assets/fonts/bootstrap/*')
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(gulp.dest(`${project.platform.output}/fonts/bootstrap`))

  return merge(taskFaCss, taskFaFonts, taskBootstrapFonts)
}
