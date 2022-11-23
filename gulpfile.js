import gulp from 'gulp'
import { path } from './gulp/config/path.js'

// shared plugins
import { plugins } from './gulp/config/plugins.js'

global.app = {
  isBuild: process.argv.includes('--build'),
  isDev: !process.argv.includes('--build'),
  gulp,
  path,
  plugins,
}

import { copy } from './gulp/tasks/copy.js'
import { reset } from './gulp/tasks/reset.js'
import { html } from './gulp/tasks/html.js'
import { server } from './gulp/tasks/server.js'
import { scss } from './gulp/tasks/scss.js'
import { js } from './gulp/tasks/js.js'
import { img } from './gulp/tasks/img.js'
import { otfToTtf, ttfToWoff, fontsStyle } from './gulp/tasks/fonts.js'
import { spriteSvg } from './gulp/tasks/svgSprite.js'
import { zip } from './gulp/tasks/zip.js'
import { ftp } from './gulp/tasks/ftp.js'

const watcher = () => {
  gulp.watch(path.watch.files, copy)
  gulp.watch(path.watch.html, html)
  gulp.watch(path.watch.scss, scss)
  gulp.watch(path.watch.js, js)
  gulp.watch(path.watch.img, img)
}

const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle)

const mainTasks = gulp.series(fonts, gulp.parallel(copy, html, scss, js, img))

const dev = gulp.series(reset, mainTasks, gulp.parallel(server, watcher))
const build = gulp.series(reset, mainTasks)
const deployZip = gulp.series(reset, mainTasks, zip)
const deployFtp = gulp.series(reset, mainTasks, ftp)

gulp.task('default', dev)

export { dev, build, spriteSvg, deployZip, deployFtp }
