'use strict';

var gulp = require('gulp'),<% if (includeScss) { %>
    sass = require('gulp-ruby-sass'),<% } %>
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    stylish = require('jshint-stylish'),
    open = require('gulp-open'),
    livereload = require('gulp-livereload'),
    growl = require('gulp-notify-growl'),
    notify = growl(),
    wiredep = require('wiredep').stream;<% if (includeScss) { %>

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

gulp.task('watch', function () {<% if (includeScss) { %>
  // Watch .scss files
  gulp.watch('./public/styles/**/*.scss', ['styles']);<% } %>
  // Watch .js files
  gulp.watch(['./public/scripts/**/*.js'], ['scripts']);

  // Create LiveReload server
  var server = livereload();

  // // Watch any files, reload on change
  gulp.watch(['./**', '!./node_modules/**', '!./public/lib/**']).on('change', function (file) {
    server.changed(file.path);
  });
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

gulp.task('default', function () {
  gulp.start(<% if (includeScss) { %>'styles', <% } %>'scripts', 'serve', 'open', 'watch');
});

// inject bower components
gulp.task('wiredep', function () {
  gulp.src('public/*.html')
  .pipe(wiredep({
    directory: 'public/lib'
  }))
  .pipe(gulp.dest('public'));
});
