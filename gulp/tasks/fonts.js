import fs from 'fs'
import fonter from 'gulp-fonter'
import ttf2woff from 'gulp-ttf2woff'
import ttf2woff2 from 'gulp-ttf2woff2'

export const otfToTtf = () => {
  return app.gulp
    .src(`${app.path.srcFolder}/fonts/*.otf`, {})
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'FONTS',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(
      fonter({
        formats: ['ttf'],
      })
    )
    .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
}

export const ttfToWoff = () => {
  return app.gulp
    .src(`${app.path.srcFolder}/fonts/*.ttf`)
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'FONTS',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(ttf2woff())
    .pipe(app.gulp.dest(app.path.build.fonts))
    .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
    .pipe(ttf2woff2())
    .pipe(app.gulp.dest(app.path.build.fonts))
}

const cb = () => {}

export const fontsStyle = () => {
  const fontsFile = `${app.path.srcFolder}/scss/fonts.scss`
  fs.readdir(app.path.src.fonts, function (err, fontsFiles) {
    if (fontsFiles) {
      if (!fs.existsSync(fontsFile)) {
        fs.writeFile(fontsFile, '', cb)
        let newFileOnly
        for (let i = 0; i < fontsFiles.length; i++) {
          const fontFileName = fontsFiles[i].split('.')[0]
          if (newFileOnly !== fontFileName) {
            const fontName = fontFileName.split('-')[0] ?? fontFileName
            let fontWeight = fontFileName.split('-')[1] ?? fontFileName

            switch (fontWeight.toLowerCase()) {
              case 'thin':
                fontWeight = 100
                break
              case 'extralight':
                fontWeight = 200
                break
              case 'light':
                fontWeight = 300
                break
              case 'medium':
                fontWeight = 500
                break
              case 'semibold':
                fontWeight = 600
                break
              case 'bold':
                fontWeight = 700
                break
              case 'extrabold' || 'heavy':
                fontWeight = 800
                break
              case 'black':
                fontWeight = 900
                break
              default:
                fontWeight = 400
                break
            }
            fs.appendFile(
              fontsFile,
              `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"),\n\t\turl("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`,
              cb
            )
            newFileOnly = fontFileName
          }
        }
      } else {
        console.log(`File scss/fonts exists. Remove it to update`)
      }
    }
  })
  return app.gulp.src(app.path.srcFolder)
}
