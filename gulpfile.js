var gulp = require('gulp');

var fs = require('fs');
var es = require('event-stream');

var gulp = require('gulp');
var concat = require('gulp-concat');
var myth = require('gulp-myth');
var connect = require('gulp-connect');
var ghpages = require('gulp-gh-pages');
var introvert = require('introvert').gulp;
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('default', ['build']);

gulp.task('build', ['build-gaia', 'build-brick']);

gulp.task('server', ['build', 'connect', 'watch']);

gulp.task('watch', function () {
  gulp.watch([
    'src/**/*', 'bower_components/**/*'
  ], ['build']);
});

gulp.task('connect', function () {
  connect.server({ port: 3001 });
});

gulp.task('build-gaia', ['gaia-scripts'], function () {
  return gulp.src(['./src/*.html'])
    .pipe(introvert('script.js', {
      'css-image-inlining': false,
      'css-url-rewriting': false,
      'minify-css': false,
      'minify-js': false,
      'substitutions': {
        "./src/script.js": "./tmp/gaia/script.js"
      }
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('gaia-scripts', function () {
  return browserify({
    entries: ['./src/script.js']
  })
  .bundle()
  .pipe(source('script.js'))
  .pipe(gulp.dest('./tmp/gaia/'));
});

gulp.task('build-brick', ['brick-scripts', 'brick-styles'], function () {
  return gulp.src(['./src/*.html'])
    .pipe(introvert('script.js', {
      'css-image-inlining': false,
      'css-url-rewriting': false,
      'minify-css': false,
      'minify-js': false,
      'substitutions': {
        "./src/style.css": "./tmp/brick/style.css",
        "./src/script.js": "./tmp/brick/script.js"
      }
    }))
    .pipe(gulp.dest('dist-brick/'));
});

gulp.task('brick-scripts', function () {
  return browserify({
    entries: ['./src/script.js']
  })
  .bundle()
  .pipe(source('script.js'))
  .pipe(gulp.dest('./tmp/brick/'));
});

gulp.task('brick-styles', function () {
  return gulp.src([
    './bower_components/gaia-theme/base.css',
    './bower_components/gaia-theme/modules.css',
    './bower_components/gaia-theme/style.css',
    './src/style.css'
  ])
  .pipe(concat('style.css'))
  .pipe(myth())
  .pipe(renameFiraSans())
  .pipe(gulp.dest('./tmp/brick/'));
});

function renameFiraSans () {
  return es.map(function (file, cb) {
    var contents =  file.contents.toString('utf8')
    contents = contents.replace('FiraSans', 'Fira Sans');
    file.contents = new Buffer(contents, 'utf8');
    return cb(null, file);
  });
}

gulp.task('deploy', ['build'], function () {
  gulp.src([
    './index.html', './index-brick.html',
    './script.js', './style.css',
    './dist/**/*', './dist-brick/**/*',
    './bower_components/**/*', './lib/**/*'
  ], { base:'./' })
  .pipe(ghpages());
});
