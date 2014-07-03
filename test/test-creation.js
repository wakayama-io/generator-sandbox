'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;

describe('the sandbox generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('sandbox:app', [
        '../../app'
      ]);

      done();
    }.bind(this));
  });

  it('creates expected project files with no extra features', function (done) {
    helpers.mockPrompt(this.app, {
      appName: 'myapp',
      basicFeatures : [],
      angularFeatures: [],
      scssFeatures : []
    });

    var expectedFiles = [
      // Add files you expect to exist here
      '.jshintrc',
      '.jscs.json',
      '.editorconfig',
      '.gitignore',
      '.gitattributes',
      'package.json',
      'bower.json',
      '.bowerrc',
      'gulpfile.js',
      'README.md',
      'public/index.html',
      'public/scripts/app.js',
      'public/styles/main.css'
    ];

    var expectedContent = [
      ['public/index.html', /<title>myapp<\/title>/],
      ['package.json', /"name": "myapp"/],
      ['bower.json', /"name": "myapp"/],
      ['README.md', /myapp/]
    ];

    this.app.options['skip-install'] = true;
    this.timeout(15000);
    this.app.run({}, function () {
      helpers.assertFile(expectedFiles);
      helpers.assertFileContent(expectedContent);
      done();
    });
  });

  it('creates expected files when all features enabled', function (done) {
    helpers.mockPrompt(this.app, {
      appName: 'myapp',
      basicFeatures : ['includeAngular', 'includeLodash', 'includeScss'],
      angularFeatures: ['includeAngularResource', 'includeAngularCookies', 'includeAngularSanitize', 'includeAngularRoute', 'includeAngularUiRouter'],
      scssFeatures : [,'includeInuitCss', 'includeNormalizeScss', 'includeCsswizardryGrids']
    });

    var expectedFiles = [
      // Add files you expect to exist here
      'public/index.html',
      'bower.json',
      '.jshintrc',
      '.gitignore',
      'public/scripts/app.js',
      'public/styles/scss/main.scss'
    ];

    var expectedContent = [
      ['public/index.html', /ng-app="myappApp"/],
      ['public/index.html', /<script src="lib\/angular\/angular.js"><\/script>/],
      ['public/index.html', /<script src="lib\/angular\/angular.js"><\/script>/],
      ['public/index.html', /<script src="lib\/angular-resource\/angular-resource.js"><\/script>/],
      ['public/index.html', /<script src="lib\/angular-cookies\/angular-cookies.js"><\/script>/],
      ['public/index.html', /<script src="lib\/angular-sanitize\/angular-sanitize.js"><\/script>/],
      ['public/index.html', /<script src="lib\/angular-route\/angular-route.js"><\/script>/],
      ['public/index.html', /<script src="lib\/angular-ui-router\/release\/angular-ui-router.js"><\/script>/],
      ['public/index.html', /<script src="lib\/lodash\/dist\/lodash.compat.js"><\/script>/],
      ['public/index.html', /<link rel="stylesheet" href="styles\/css\/main.css">/],
      ['bower.json', /"name": "myapp"/],
      ['bower.json', /"angular"/],
      ['bower.json', /"angular-mocks"/],
      ['bower.json', /"angular-scenario"/],
      ['bower.json', /"angular-resource"/],
      ['bower.json', /"angular-cookies"/],
      ['bower.json', /"angular-sanitize"/],
      ['bower.json', /"angular-route"/],
      ['bower.json', /"angular-ui-router"/],
      ['bower.json', /"lodash"/],
      ['bower.json', /"inuit.css"/],
      ['bower.json', /"modularized-normalize-scss"/],
      ['bower.json', /"csswizardry-grids"/],
      ['.jshintrc', /"angular": true/],
      ['.jshintrc', /"_": true/],
      ['.gitignore', /### Sass ###/],
      ['.gitignore', /.sass-cache\//],
      ['public/styles/scss/main.scss', /@import "..\/..\/lib\/inuit.css\/inuit";/],
      ['public/styles/scss/main.scss', /@import "..\/..\/lib\/modularized-normalize-scss\/normalize";/],
      ['public/styles/scss/main.scss', /@import "..\/..\/lib\/csswizardry-grids\/csswizardry-grids";/]
    ];

    this.app.options['skip-install'] = true;
    this.timeout(15000);
    this.app.run({}, function () {
      helpers.assertFile(expectedFiles);
      helpers.assertFileContent(expectedContent);
      done();
    });
  });

  describe('angular karma tests', function () {
    this.timeout(25000);

    it('creates karma test files when angular enabled', function (done) {
      helpers.mockPrompt(this.app, {
        appName: 'myapp',
        basicFeatures : ['includeAngular']
      });

      var expectedContent = [
        ['package.json', /"karma"/],
        ['package.json', /"karma-jasmine"/],
        ['package.json', /"karma-chrome-launcher"/],
        ['package.json', /"gulp-util"/],
        ['package.json', /"lodash"/]
      ];

      this.app.options['skip-install'] = true;
      this.app.run({}, function () {
        helpers.assertFileContent(expectedContent);
        done();
      });
    });

    it('creates the correct content into the gulpfile when angular enabled', function (done) {
      helpers.mockPrompt(this.app, {
        appName: 'myapp',
        basicFeatures : ['includeAngular']
      });

      var expectedContent = [
        ['gulpfile.js', /karma = require\('karma'\).server/],
        ['gulpfile.js', /_ = require\('lodash'\)/],
        ['gulpfile.js', /karma.start\(_.assign\({}, karmaCommonConf, {singleRun: true}\), karmaExit\);/],
        ['gulpfile.js', /gulp.watch\(\['.\/public\/scripts\/\*\*\/\*.js', '.\/test\/\*\*\/\*.js', 'gulpfile.js'\], \['test'\]\);/]
      ];

      this.app.options['skip-install'] = true;
      this.app.run({}, function () {
        helpers.assertFileContent(expectedContent);
        done();
      });
    });
  });

  describe('gulpicon', function () {

    this.timeout(15000);

    it('creates the correct files if enabled', function (done) {
      helpers.mockPrompt(this.app, {
        appName: 'myapp',
        basicFeatures : ['includeGulpicon']
      });

      var expectedFiles = [
        // Add files you expect to exist here
        'public/images/',
        'public/images/icons/',
        'public/images/icons/src/',
        'public/images/icons/templates/',
        'public/images/icons/templates/gulpicon-styles.hbs',
        'public/images/icons/templates/gulpicon-preview.hbs',
        'public/images/icons/lib/',
        'public/images/icons/lib/img-stats.js',
        'public/images/icons/lib/gulpicon-helper.js',
        'public/images/icons/lib/gulpicon-loader.js'
      ];

      this.app.options['skip-install'] = true;
      this.app.run({}, function () {
        helpers.assertFiles(expectedFiles);
        done();
      });
    });

    it('creates the correct content into the gulpfile when gulpicon enabled', function (done) {
      helpers.mockPrompt(this.app, {
        appName: 'myapp',
        basicFeatures : ['includeGulpicon']
      });

      var expectedContent = [
        ['package.json', /"rimraf"/],
        ['package.json', /"directory-encoder"/],
        ['package.json', /"gulp-svgmin"/],
        ['package.json', /"svg-to-png"/],
        ['package.json', /"gulp-filter"/],
        ['package.json', /"gulp-rename"/],
        ['package.json', /"event-stream"/],
        ['package.json', /"xmldom"/],
        ['package.json', /"handlebars"/],
        ['package.json', /"lodash"/],
        ['package.json', /"uglify-js"/],
        ['gulpfile.js', /gulp.task\(\'gulpicon\', \[\'clean-gulpicon\'\], function \(\) {/],
        ['public/index.html', /<noscript><link href="images\/icons\/dest\/icons.fallback.css" rel="stylesheet"><\/noscript>/],
        ['public/index.html' ,/gulpicon\(\["images\/icons\/dest\/icons.data.svg.css", "images\/icons\/dest\/icons.data.png.css", "images\/icons\/dest\/icons.fallback.css"\]\);/],
        ['public/index.html', /<script src="images\/icons\/lib\/gulpicon-loader.js"><\/script>/]
      ];

      this.app.options['skip-install'] = true;
      this.app.run({}, function () {
        helpers.assertFileContent(expectedContent);
        done();
      });
    });
  });

});
