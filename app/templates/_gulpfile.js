'use strict';

var gulp = require('gulp'),
    path = require('path'),<% if (includeScss) { %>
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

gulp.task('gulpicon', function () {
  var es = require('event-stream'),
      clean = require('gulp-clean'),
      filter = require('gulp-filter'),
      rename = require('gulp-rename'),
      svgToPng = require('svg-to-png'),
      svgmin = require('gulp-svgmin'),
      DirectoryEncoder = require('directory-encoder'),
      icons = path.join(__dirname, '/public/images/icons/'),
      src = path.join(icons, '/src/**/*'),
      dest = path.join(icons, '/dest/'),
      svgtmp = path.join(dest, '/svgtmp/'),
      pngtmp = path.join(dest, '/pngtmp/'),
      pngs = path.join(dest, '/pngs/'),
      dataSvgCss = path.join(dest, '/_icons.data.svg.css'),
      dataPngCss = path.join(dest, '/_icons.data.png.css'),
      urlPngCss = path.join(dest, '/_icons.fallback.css'),
      iconPrefix = 'icon-';

  // TODO: should be its own task
  // Remove dest folder
  // gulp.src(dest, {read: false})
  //   .pipe(clean());

  // Copy all png icons with added icon- prefix to pngtmp and pngs
  // and all svg icons with added icon- prefix to svgtmp
  var pngFilter = filter('**/*.png');
  var svgFilter = filter('**/*.svg');

  es.concat(
    gulp.src(src)
      .pipe(pngFilter)
      .pipe(rename({prefix: iconPrefix}))
      .pipe(gulp.dest(pngtmp))
      .pipe(gulp.dest(pngs))
      .pipe(pngFilter.restore())
      .pipe(svgFilter)
      .pipe(rename({prefix: iconPrefix}))
      .pipe(svgmin())
      .pipe(gulp.dest(svgtmp))
  ).on('end', function(){
    // es.concat - combines the streams and ends only when all streams emitted end

    // Convert svg icons to pngs and copy icons to pngs
    var svgToPngOpts = {
      defaultWidth: "400px",
      defaultHeight: "300px"
    };
    svgToPng.convert( svgtmp, pngs, svgToPngOpts )
      .then( function( result , err ){
        if( err ){
          throw new Error( err );
        }
        var deDataConfig = {
          pngfolder: pngs,
          // customselectors: config.customselectors,
          // template: path.resolve( config.template ),
          // previewTemplate: path.resolve( config.previewTemplate ),
          noencodepng: false,
          prefix: '.'
        };
        var deUrlConfig = {
          pngfolder: pngs,
          pngpath: './images/icons/dest/pngs/',
          // customselectors: config.customselectors,
          // template: path.resolve( config.template ),
          // previewTemplate: path.resolve( config.previewTemplate ),
          noencodepng: true,
          prefix: '.'
        };

        var svgde = new DirectoryEncoder(svgtmp, dataSvgCss, deDataConfig ),
          pngde = new DirectoryEncoder( pngtmp , dataPngCss, deDataConfig ),
          pngdefall = new DirectoryEncoder( pngs , urlPngCss, deUrlConfig );

        console.log("Writing CSS");

        try {
          svgde.encode();
          pngde.encode();
          pngdefall.encode();
        } catch( e ){
          throw new Error( e );
        }

        // Create preview file

        // Remove svg- and pngtmp
        es.concat(
          gulp.src(svgtmp, {read: false})
            .pipe(clean()),
          gulp.src(pngtmp, {read: false})
            .pipe(clean())
        ).on('end', function(){
          console.log('done');
        });
    });
  });
});

gulp.task('default', function () {
  gulp.start(<% if (includeScss) { %>'styles', <% } %>'scripts', 'serve', 'open', 'watch');
});
