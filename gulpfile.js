'use strict';

var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var stylish = require('jshint-stylish');
var istanbul = require('gulp-istanbul');
var mocha  = require('gulp-mocha');
var _  = require('lodash');
var path = require('path');

var paths = {
  lint: ['gulpfile.js', 'app/index.js'],
  tests: ['./test/**/*.js', '!test/{temp,temp/**}'],
  source: ['app/index.js']
};

gulp.task('lint', function () {
  return gulp.src(paths.lint)
    .pipe(jshint(path.join(__dirname, '.jshintrc')))
    .pipe(jscs(path.join(__dirname, '.jscs.json')))
    .pipe(jshint.reporter(stylish));
});

gulp.task('istanbul', function (cb) {
  gulp.src(paths.source)
    .pipe(istanbul()) // Covering files
    .on('end', function () {
      gulp.src(paths.tests, {cwd: __dirname})
        .pipe(mocha())
        .pipe(istanbul.writeReports()) // Creating the reports after tests run
        .on('end', cb);
    });
});

gulp.task('test', ['lint', 'istanbul']);

gulp.task('watch', function () {
  gulp.run('istanbul');
  gulp.watch(_.union(paths.lint, paths.tests), ['istanbul']);
});
