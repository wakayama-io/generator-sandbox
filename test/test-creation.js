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
      'public/scripts/main.js',
      'public/styles/main.css'
    ];

    var expectedContent = [
      ['public/index.html', /<title>myapp<\/title>/],
      ['package.json', /"name": "myapp"/],
      ['bower.json', /"name": "myapp"/],
      ['README.md', /myapp/]
    ];

    this.app.options['skip-install'] = true;
    this.timeout(5000);
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
      scssFeatures : [,'includeInuitCss','includeNormalizeScss', 'includeCsswizardryGrids']
    });

    var expectedFiles = [
      // Add files you expect to exist here
      'public/index.html',
      'bower.json',
      '.jshintrc',
      '.gitignore',
      'public/scripts/main.js',
      'public/styles/scss/main.scss'
    ];

    var expectedContent = [
      ['public/index.html', /ng-app="myapp"/],
      ['public/index.html', /<script src="lib\/angular\/angular.js"><\/script>/],
      ['public/index.html', /<script src="lib\/lodash\/dist\/lodash.compat.js"><\/script>/],
      ['public/index.html', /<link rel="stylesheet" href="styles\/css\/main.css">/],
      ['bower.json', /"name": "myapp"/],
      ['bower.json', /"angular"/],
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
});
