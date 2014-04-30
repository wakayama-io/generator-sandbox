'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;

describe('sandbox generator', function () {
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

  it('creates expected project files', function (done) {
    helpers.mockPrompt(this.app, {
      appName: 'myapp',
      basicFeatures : [],
      scssFeatures : []
    });

    var expectedFiles = [
      // Add files you expect to exist here
      '.jshintrc',
      '.editorconfig',
      'bower.json',
      'public/index.html',
      'public/scripts/main.js',
      'public/styles/main.css'
    ];

    var expectedContent = [
      ['public/index.html', /<title>myapp<\/title>/],
      ['bower.json', /"name": "myapp"/]
    ];

    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expectedFiles);
      helpers.assertFileContent(expectedContent);
      done();
    });
  });

  it('should generate an angular app', function (done) {
    this.timeout(15000);
    helpers.mockPrompt(this.app, {
      appName: 'myapp',
      basicFeatures : ['includeAngular', 'includeLodash', 'includeNormalizeCss', 'includeCsswizardryGrids', 'includeScss'],
      scssFeatures : ['includeBourbon']
    });

    var expectedFiles = [
      // Add files you expect to exist here
      '.jshintrc',
      '.editorconfig',
      'public/index.html',
      'bower.json',
      'public/scripts/main.js',
      'public/styles/scss/main.scss'
    ];

    var expectedContent = [
      ['public/index.html', /<title>myapp<\/title>/],
      ['bower.json', /"name": "myapp"/],
      ['bower.json', /"angular"/],
      ['bower.json', /"lodash"/],
      ['bower.json', /"normalize.css"/],
      ['bower.json', /"csswizardry-grids"/],
      ['bower.json', /"bourbon"/],
      ['.jshintrc', /"angular": true/]
    ];

    this.app.options['skip-install'] = true;

    this.app.run({}, function () {
      helpers.assertFile(expectedFiles);
      helpers.assertFileContent(expectedContent);
      done();
    });
  });
});
