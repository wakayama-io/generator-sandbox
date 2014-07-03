'use strict';

var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),<% if (includeGulpicon) { %>
    rimraf = require('rimraf'),<% } %>
    path = require('path'),
    nn = require('node-notifier'),
    growlNotify = plugins.notify.withReporter(function (options, callback) {
      new nn.Growl().notify(options, callback);
    }),
    stylish = require('jshint-stylish'),<% if (includeAngular) { %>
    karma = require('karma').server,
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
  plugins.util.log('Karma has exited with ' + exitCode);

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
    .pipe(plugins.plumber())
    .pipe(plugins.rubySass())
    .pipe(plugins.csso(true)) // disable structureMinimization
    .pipe(plugins.plumber.stop())
    .pipe(gulp.dest('./public/styles/css'))
    .pipe(growlNotify({
      title: 'Done.',
      message: 'Styles task complete'
    }));
});<% } %>

gulp.task('scripts', function () {
  return gulp.src('./public/scripts/**/*.js')
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jscs())
    .pipe(plugins.jshint.reporter(stylish))
    .pipe(growlNotify({
      title: 'Done.',
      message: 'Scripts task complete'
    }));
});

gulp.task('serve', function () {
  var server = require('connect')(),
      serveStatic = require('serve-static'),
      morgan  = require('morgan'),
      directory = path.join(__dirname, '/public'),
      port = 3000;
  server.use(serveStatic(directory));
  server.use(morgan({ format: 'dev', immediate: true }));
  server.listen(port);
});

gulp.task('open', ['scripts'<% if (includeScss) { %>, 'styles'<% } %>], function () {
  // A file must be specified as the src when running options.url or gulp will overlook the task.
  gulp.src('./public/index.html')
  .pipe(plugins.open('', {url: 'http://localhost:3000'}));
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
  var server = plugins.livereload();

  // // Watch any files, reload on change
  gulp.watch(['./**', '!./node_modules/**', '!./public/lib/**']).on('change', function (file) {
    server.changed(file.path);
  });<% if (includeAngular) { %>

  watching = true;
  gulp.run('test');
  gulp.watch(['./public/scripts/**/*.js', './test/**/*.js', 'gulpfile.js'], ['test']);<% } %>
});<% if (includeGulpicon) { %>

gulp.task('clean-gulpicon', function () {
  var icons = path.join(__dirname, '/public/images/icons/'),
      dest = path.join(icons, '/dest/');

  return rimraf.sync(dest);
});

gulp.task('gulpicon', ['clean-gulpicon'], function () {
  var fs = require('fs'),
      Q = require('q'),
      mkdirp = require('mkdirp'),
      svgToPng = require('svg-to-png'),
      DirectoryEncoder = require('directory-encoder'),
      uglify = require('uglify-js');

  var icons = path.join(__dirname, '/public/images/icons/'),
      src = path.join(icons, '/src/**/*'),
      dest = path.join(icons, '/dest/'),
      tmp = path.join(dest, '/tmp/'),
      pngs = path.join(dest, '/pngs/'),
      pngFilter = plugins.filter('**/*.png'),
      svgFilter = plugins.filter('**/*.svg'),
      dataSvgCss = path.join(dest, '/icons.data.svg.css'),
      dataPngCss = path.join(dest, '/icons.data.png.css'),
      urlPngCss = path.join(dest, '/icons.fallback.css'),
      iconPrefix = 'icon-',
      helper = require(path.join(icons, '/lib/gulpicon-helper')),
      deferred = Q.defer();

  // Create folders
  mkdirp.sync(dest);
  mkdirp.sync(tmp);
  mkdirp.sync(pngs);

  gulp.src(src)
    .pipe(pngFilter) // Filter pngs
    .pipe(plugins.rename({prefix: iconPrefix})) // Add icon prefix
    .pipe(gulp.dest(pngs))  // Put them in pngs
    .pipe(pngFilter.restore())
    .pipe(svgFilter)  // Filter svgs
    .pipe(plugins.rename({prefix: iconPrefix})) // Add icon prefix
    .pipe(plugins.svgmin()) // Clean them
    .pipe(gulp.dest(tmp))  // Put them in tmp folder
    .on('end', function () {
      var svgToPngOpts = {
        defaultWidth: '400px',
        defaultHeight: '300px'
      };
      svgToPng.convert(tmp, pngs, svgToPngOpts)  // Convert svgs to pngs and put them in pngs folder
      .then(function () {
        var deDataConfig = {
          pngfolder: pngs,
          pngpath: './pngs/',
          customselectors: {},
          template: path.resolve('./public/images/icons/templates/gulpicon-styles.hbs'),
          noencodepng: false,
          prefix: '.'
        };
        var deUrlConfig = {
          pngfolder: pngs,
          pngpath: './pngs/',
          customselectors: {},
          template: path.resolve('./public/images/icons/templates/gulpicon-styles.hbs'),
          noencodepng: true,
          prefix: '.'
        };
        var svgde = new DirectoryEncoder(tmp, dataSvgCss, deDataConfig),
            pngde = new DirectoryEncoder(pngs, dataPngCss, deDataConfig),
            pngdefall = new DirectoryEncoder(pngs, urlPngCss, deUrlConfig);

        plugins.util.log('Writing CSS');

        try {
            svgde.encode();
            pngde.encode();
            pngdefall.encode();
        } catch (e) {
          throw new Error(e);
        }

        plugins.util.log('Generating Preview');

        // generate preview
        var previewTemplate = path.join(__dirname, '/public/images/icons/templates/gulpicon-preview.hbs');
        var previewhtml = 'preview.html';
        var cssPrefix = '.';
        var loader = path.join(__dirname, '/public/images/icons/lib/', 'gulpicon-loader.js');
        var loaderMin = uglify.minify(loader).code;

        try {
          helper.createPreview(tmp, dest, '400px', '300px', loaderMin, previewhtml, cssPrefix, previewTemplate);
        } catch (er) {
          throw new Error(er);
        }

        plugins.util.log('Cleaning up');

        rimraf(tmp, function () { // Clean tmp folder
          // Create files if doesn't exist
          var exists = fs.existsSync(dataSvgCss);
          if (!exists) {
            fs.writeFileSync(dataSvgCss, '');
          }
          exists = fs.existsSync(dataPngCss);
          if (!exists) {
            fs.writeFileSync(dataPngCss, '');
          }
          exists = fs.existsSync(urlPngCss);
          if (!exists) {
            fs.writeFileSync(urlPngCss, '');
          }
          plugins.util.log('done');
          deferred.resolve();
        });
      });
    });

  return deferred.promise;
});<% } %>

gulp.task('default', <% if (includeGulpicon) { %>['gulpicon'], <% } %>function () {
  gulp.start(<% if (includeScss) { %>'styles', <% } %>'scripts', 'serve', 'open', 'watch');
});
