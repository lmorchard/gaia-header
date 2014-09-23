var util = require('util');
var gulp = require('gulp');

var fs = require('fs');
var es = require('event-stream');

var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var ghpages = require('gulp-gh-pages');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var esprima = require('esprima');
var escodegen = require('escodegen');
var types = require('ast-types');
var cheerio = require('cheerio');
var myth = require('myth');

var scriptPaths = [
  './gaia-*.js'
];

var baseCSSPaths = [
  './bower_components/gaia-theme/base.css',
  './bower_components/gaia-theme/modules.css',
  './bower_components/gaia-theme/style.css'
];

gulp.task('default', ['build']);

gulp.task('build', ['build-brick']);

gulp.task('server', ['build', 'connect', 'watch']);

gulp.task('connect', function () {
  connect.server({ port: 3001 });
});

gulp.task('watch', function () {
  gulp.watch([
    'src/**/*', 'bower_components/**/*'
  ], ['build']);
});

gulp.task('deploy', ['build'], function () {
  gulp.src([
    './index.html', './index-brick.html',
    './script.js', './style.css',
    './dist/**/*', './dist-brick/**/*',
    './bower_components/**/*', './lib/**/*'
  ], { base:'./' })
  .pipe(ghpages());
});

gulp.task('build-brick', function () {
  return gulp.src(scriptPaths)
  .pipe(mungeComponentJS())
  .pipe(gulp.dest('./dist-brick'));
});

function mungeComponentJS () {
  return es.map(function (file, cb) {
    var src = file.contents.toString('utf-8');
    var ast = esprima.parse(src);

    types.visit(ast, {
      // Find template.innerHTML = `...`  or template = `...`
      // TODO: Any way to make this less fragile?
      visitTemplateLiteral: function (path) {
        var parent = path.parent.node;
        var shouldMunge =
          (('AssignmentExpression' === parent.type &&
            'innerHTML' === parent.left.property.name) ||
           ('VariableDeclarator' === parent.type &&
            'template' === parent.id.name));
        if (shouldMunge) {
          // TODO: Account for all the .quasis and .expressions
          var fromHTML = path.value.quasis[0].value.raw;
          var toHTML = mungeComponentHTML(fromHTML);
          var newNode = types.builders.literal(toHTML);
          path.replace(newNode);
        }
        return this.traverse(path);
      }
    });

    var outJS = escodegen.generate(ast);
    file.contents = new Buffer(outJS, 'utf8');
    return cb(null, file);
  });
}

function mungeComponentHTML (html) {
  var $ = cheerio.load(html);

  var css = $('style').text();
  $('style').text(mungeComponentCSS(css));

  return $.html();
}

function mungeComponentCSS (css) {

  // HACK: Load up all the base CSS before processing
  var baseCSS = baseCSSPaths.map(function (path) {
    return fs.readFileSync(path, 'utf8');
  }).join("\n");

  // So far, just run myth over the CSS
  css = myth(baseCSS + "\n" + css);

  return css;

}
