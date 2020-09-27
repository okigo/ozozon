const gulp = require("gulp");
const del = require('del');
const newer = require("gulp-newer");
const gulpif = require('gulp-if');
const buffer = require('vinyl-buffer');
const merge = require('merge-stream');
const combine = require('stream-combiner2').obj;
const rename = require("gulp-rename");
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const imagemin = require('gulp-imagemin');
const spritesmith = require('gulp.spritesmith');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const beautify = require('gulp-beautify');

// Paths
const paths = {
  // roots
  'root': '.',
  'src': 'src',
  'dst': 'docs',
  // rev-manifest
  'srcREVMANIFEST': 'src/resources/rev-manifest/rev-manifest.json',
  'dstREVMANIFEST': 'src/resources/rev-manifest/',
  // to the root
  'rootTO': 'src/resources/toroot/**',
  // pug
  'rootPUG': 'src/pug/**',
  'srcPUG': 'src/pug/pages/*.pug',
  'srcHTML': 'docs/index.html',
  // js
  'rootJS': 'src/js/**',
  'srcJS': 'src/js/*.+(js|min.js)',
  'dstJS': 'docs/js',
  // sass
  'rootSASS': 'src/sass/**',
  'srcSASS': 'src/sass/*.+(sass|scss)',
  'dstCSS': 'docs/css',
  // images
  'rootIMG': 'src/resources/images/**',
  'dstIMG': 'docs/img',
  // sprite
  'rootSPRITE': 'src/resources/sprite/**',
  'srcSPRITE': 'src/resources/sprite/*.png',
  'dstSPRITE': '../img/sprite.png',
  'dstSASSSPRITE': 'src/sass/components/',
  'cleanSASSSPRITE': 'src/sass/components/_sprite.sass',
  // fonts
  'rootFONTS': 'src/resources/fonts/**',
  'dstFONTS': 'docs/fonts',
};

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

gulp.task('clean', function() {
  return del([paths.dst, paths.cleanSASSSPRITE, paths.dstREVMANIFEST]);
});

gulp.task('toroot', function() {
  return gulp.src(paths.rootTO, {since: gulp.lastRun('toroot')})
    .pipe(newer(paths.dst))
    .pipe(gulp.dest(paths.dst));
});

gulp.task('img', function() {
  return gulp.src(paths.rootIMG, {since: gulp.lastRun('img')})
    .pipe(newer(paths.dstIMG))
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dstIMG));
});

gulp.task('sprite', function () {
  const spriteData = gulp.src(paths.srcSPRITE).pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: paths.dstSPRITE,
    cssName: '_sprite.sass',
    cssFormat: 'sass',
    cssVarMap: function (sprite) {
      sprite.name = 'ico_' + sprite.name;
    }
  }));

  const imgStream = spriteData.img
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dstIMG));

  const cssStream = spriteData.css
    .pipe(gulp.dest(paths.dstSASSSPRITE));

  return merge(imgStream, cssStream);
});

gulp.task('fonts', function () {
  return gulp.src(paths.rootFONTS)
    .pipe(gulp.dest(paths.dstFONTS));
});

gulp.task('js', function() {
  return gulp.src(paths.srcJS)
    .pipe(babel())
    .pipe(gulpif(isDev,
      combine(
        beautify.js({ indent_size: 2 }),
        gulp.dest(paths.dstJS)
      ),
      combine(
        uglify(),
        rename({extname: '.min.js'}),
        gulp.dest(paths.dstREVMANIFEST)
      )
    ));
});

gulp.task('styles', function() {
  return gulp.src(paths.srcSASS)
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(sass(gulpif(!isDev, {outputStyle: 'compressed'})).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulpif(isDev,
      combine(
        beautify.css({ indent_size: 2 }),
        sourcemaps.write(),
        gulp.dest(paths.dstCSS)
      ),
      combine(
        rename({extname: '.min.css'}),
        gulp.dest(paths.dstREVMANIFEST)
      )
    ));
});

gulp.task('revision', gulp.series('js', 'styles', function() {
  return gulp.src([paths.dstREVMANIFEST + '*.js', paths.dstREVMANIFEST + '*.css'])
    .pipe(gulpif(!isDev,
      combine(
        rev(),
        gulpif('*.js', gulp.dest(paths.dstJS)),
        gulpif('*.css', gulp.dest(paths.dstCSS)),
        rev.manifest(),
        gulp.dest(paths.dstREVMANIFEST)
      )
    ));
}));

function replaceUnrevedMin(filename) {
  if (filename.indexOf('.min') > -1) {
      return filename.replace('.min', '');
  }
  return filename;
}

gulp.task('views', function() {
  const manifest = gulp.src(paths.srcREVMANIFEST, {allowEmpty: true});

  return gulp.src(paths.srcPUG)
    .pipe(pug())
    .pipe(beautify.html({ indent_size: 2 }))
    .pipe(gulpif(!isDev,
      revReplace({
        manifest: manifest,
        modifyUnreved: replaceUnrevedMin
    })))
    .pipe(gulp.dest(paths.dst));
});

gulp.task('watch', function() {
  gulp.watch(paths.rootPUG, gulp.series('views'));
  gulp.watch(paths.rootJS, gulp.series('js'));
  gulp.watch(paths.rootIMG, gulp.series('img'));
  gulp.watch(paths.rootSPRITE, gulp.series('sprite'));
  gulp.watch(paths.rootTO, gulp.series('toroot'));
  gulp.watch(paths.rootFONTS, gulp.series('fonts'));
  gulp.watch(paths.rootSASS, gulp.series('styles'));
});

gulp.task('serve', function() {
  browserSync.init({
    server: paths.dst,
    notify: false
  });
  browserSync.watch(paths.dst).on('change', browserSync.reload);
});

gulp.task('build', gulp.series('clean', gulp.parallel('toroot', 'img', 'sprite', 'fonts'), 'revision', 'views'));

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'serve')));

// "development": gulp
// "production": NODE_ENV=production gulp
// "production": ($env:NODE_ENV="production") -and (gulp) // PowerShell