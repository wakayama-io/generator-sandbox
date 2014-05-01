'use strict';

var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var stylish = require('jshint-stylish');
var istanbul = require('gulp-istanbul');
var mocha  = require('gulp-mocha');

var paths = {
  lint: ['./gulpfile.js', './app/index.js'],
  tests: ['./test/**/*.js', '!test/{temp,temp/**}'],
  source: ['./app/index.js']
};

gulp.task('lint', function () {
  return gulp.src(paths.lint)
    .pipe(jshint('.jshintrc'))
    .pipe(jscs())
    .pipe(jshint.reporter(stylish));
});

gulp.task('istanbul', function (cb) {
  gulp.src(paths.source)
    .pipe(istanbul()) // Covering files
    .on('end', function () {
      gulp.src(paths.tests)
        .pipe(mocha())
        .pipe(istanbul.writeReports()) // Creating the reports after tests run
        .on('end', cb);
    });
});

gulp.task('test', ['lint', 'istanbul']);
