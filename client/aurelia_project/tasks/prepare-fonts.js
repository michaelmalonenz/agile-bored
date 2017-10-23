import gulp from 'gulp'
import merge from 'merge-stream'
import changedInPlace from 'gulp-changed-in-place'
import project from '../aurelia.json'

export default function prepareFonts () {
  const source = 'node_modules/font-awesome'

  const taskCss = gulp.src(`${source}/css/font-awesome.min.css`)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(gulp.dest(`${project.platform.output}/css`))

  const taskFonts = gulp.src(`${source}/fonts/*`)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(gulp.dest(`${project.platform.output}/fonts`))

  const taskBootstrapFonts = gulp.src('node_modules/bootstrap-sass/assets/fonts/bootstrap/*')
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(gulp.dest(`${project.platform.output}/fonts/bootstrap`))

  return merge(taskCss, taskFonts, taskBootstrapFonts)
}
