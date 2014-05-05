'use strict';

var gulp = require('gulp'),<% if (includeScss) { %>
    sass = require('gulp-ruby-sass'),<% } %>
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    stylish = require('jshint-stylish'),
    open = require('gulp-open'),
    livereload = require('gulp-livereload'),
    growl = require('gulp-notify-growl'),
    notify = growl(),<% if (includeAngular) { %>
    karma = require('karma').server,
    gutil = require('gulp-util'),
    _ = require('lodash'),<% } %>
    wiredep = require('wiredep').stream;<% if (includeAngular) { %>

// one could also externalize common config into a separate file,
// ex.: var karmaCommonConf = require('./karma-common-conf.js');
var karmaCommonConf = {
  browsers: ['Chrome'],
  frameworks: ['jasmine'],
  files: [
    './public/lib/angular/angular.js',
    './public/lib/angular-mocks/angular-mocks.js',
    './public/scripts/**/*.js',
    './test/**/*.js'
  ]
};

// flag to determine if we have to exit the process or not
// it's true while watching
var watching = false;

// a helper function to report karma's exit status
function karmaExit(exitCode) {
  gutil.log('Karma has exited with ' + exitCode);

  // do not kill process when watching
  if (!watching) {
    process.exit(exitCode);
  }
}

/**
 * Run test once and exit
 */
gulp.task('test', function () {
  karma.start(_.assign({}, karmaCommonConf, {singleRun: true}), karmaExit);
});<% } %><% if (includeScss) { %>

gulp.task('styles', function () {
  return gulp.src('./public/styles/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/styles/css'))
    .pipe(notify({
      title: 'Done.',
      message: 'Styles task complete'
    }));
});<% } %>

gulp.task('scripts', function () {
  return gulp.src('./public/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jscs())
    .pipe(jshint.reporter(stylish))
    .pipe(notify({
      title: 'Done.',
      message: 'Scripts task complete'
    }));
});

gulp.task('serve', function () {
  var connect = require('connect'),
      directory = __dirname + '/public',
      port = 3000;

  connect()
    .use(connect.logger('dev'))
    .use(connect.static(directory))
    .listen(port);
});

gulp.task('open', ['scripts'<% if (includeScss) { %>, 'styles'<% } %>], function () {
  // A file must be specified as the src when running options.url or gulp will overlook the task.
  gulp.src('./public/index.html')
  .pipe(open('', {url: 'http://localhost:3000'}));
});

// inject bower components
gulp.task('wiredep', function () {
  gulp.src('public/*.html')
  .pipe(wiredep({
    directory: 'public/lib',
    exclude: [<%=wiredepScriptExcludes%>]
  }))
  .pipe(gulp.dest('public'));<% if (includeScss) { %>

  gulp.src('public/styles/scss/*.scss')
  .pipe(wiredep({
    directory: 'public/lib',
    exclude: [<%=wiredepScssExcludes%>]
  }))
  .pipe(gulp.dest('public/styles/scss'));<% } %>
});

gulp.task('watch', function () {<% if (includeScss) { %>
  // Watch .scss files
  gulp.watch('./public/styles/**/*.scss', ['styles']);<% } %>
  // Watch .js files
  gulp.watch(['./public/scripts/**/*.js'], ['scripts']);
  // Watch bower.json
  gulp.watch('./bower.json', ['wiredep']);

  // Create LiveReload server
  var server = livereload();

  // // Watch any files, reload on change
  gulp.watch(['./**', '!./node_modules/**', '!./public/lib/**']).on('change', function (file) {
    server.changed(file.path);
  });<% if (includeAngular) { %>

  watching = true;
  gulp.run('test');
  gulp.watch(['./public/scripts/**/*.js', './test/**/*.js', 'gulpfile.js'], ['test']);<% } %>
});

gulp.task('default', function () {
  gulp.start(<% if (includeScss) { %>'styles', <% } %>'scripts', 'serve', 'open', 'watch');
});
