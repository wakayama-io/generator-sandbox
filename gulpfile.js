'use strict';

var gulp   = require('gulp');
var stylish = require('jshint-stylish');
var _  = require('lodash');
var path = require('path');
var plugins = require('gulp-load-plugins')();

var paths = {
  lint: ['gulpfile.js', 'app/index.js'],
  tests: ['./test/**/*.js', '!./test/{temp,temp/**}'],
  source: ['./app/index.js']
};

gulp.task('lint', function () {
  return gulp.src(paths.lint)
    .pipe(plugins.jshint(path.join(__dirname, '.jshintrc')))
    .pipe(plugins.jscs(path.join(__dirname, '.jscs.json')))
    .pipe(plugins.jshint.reporter(stylish));
});

gulp.task('istanbul', function (cb) {
  gulp.src(paths.source)
    .pipe(plugins.istanbul()) // Covering files
    .on('finish', function () {
      gulp.src(paths.tests, {cwd: __dirname})
        .pipe(plugins.mocha())
        .pipe(plugins.istanbul.writeReports()) // Creating the reports after tests run
        .on('finish', function () {
          process.chdir(__dirname);
          cb();
        });
    });
});

gulp.task('test', ['lint', 'istanbul']);

gulp.task('watch', ['istanbul'], function () {
  gulp.watch(_.union(paths.lint, paths.tests), ['istanbul']);
});

gulp.task('default', ['test']);
