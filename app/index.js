'use strict';

var yeoman = require('yeoman-generator');
var util = require('util');
var path = require('path');
var chalk = require('chalk');
var _ = require('lodash');

var SandboxGenerator =  module.exports = function SandboxGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  this.pkg = require('../package.json');
  this.options = options;

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });
};

util.inherits(SandboxGenerator, yeoman.generators.Base);

SandboxGenerator.prototype._prettyJSON = function _prettyJSON (obj){
  return JSON.stringify(obj, null, 2);
};

// Welcome message
SandboxGenerator.prototype.welcome = function welcome() {
  this.log(this.yeoman);
  this.log(chalk.magenta('Welcome to the Sandbox generator.'));
};

SandboxGenerator.prototype.promptUser = function promptUser() {
  var done = this.async();

  var prompts = [{
    name: 'appName',
    message: 'What is the name of your app?',
    default: path.basename(process.cwd())
  }, {
    type: 'checkbox',
    name: 'basicFeatures',
    message: 'What would you like to include?',
    choices: [{
      name: 'AngularJS',
      value: 'includeAngular',
      checked: false
    }, {
      name: 'Lo-dash',
      value: 'includeLodash',
      checked: false
    }, {
      name: 'Normalize.css',
      value: 'includeNormalizeCss',
      checked: false
    }, {
      name: 'Csswizardry-grids',
      value: 'includeCsswizardryGrids',
      checked: false
    }, {
      name: 'SCSS',
      value: 'includeScss',
      checked: false
    }]
  }, {
    when: function (answers) {
      return answers.basicFeatures.indexOf('includeScss') !== -1;
    },
    type: 'checkbox',
    name: 'scssFeatures',
    message: 'Which SCSS features would you like to include?',
    choices: [{
      name: 'Bourbon',
      value: 'includeBourbon',
      checked: false
    }]
  }];

  this.prompt(prompts, function (answers) {
    this.appName = answers.appName;
    var features = answers.basicFeatures.concat(answers.scssFeatures);

    function hasFeature(feat) {
      return features.indexOf(feat) !== -1;
    }
    this.includeAngular = hasFeature('includeAngular');
    this.includeLodash = hasFeature('includeLodash');
    this.includeScss = hasFeature('includeScss');
    this.includeNormalizeCss = hasFeature('includeNormalizeCss');
    this.includeCsswizardryGrids = hasFeature('includeCsswizardryGrids');
    this.includeBourbon = hasFeature('includeBourbon');

    done();
  }.bind(this));
};

SandboxGenerator.prototype.app = function app() {
  this.mkdir('public');
  this.mkdir('public/scripts');
  this.mkdir('public/styles');

  this.template('_index.html', 'public/index.html');
  this.template('_main.js', 'public/scripts/main.js');

  if (this.includeScss) {
    this.mkdir('public/styles/css');
    this.mkdir('public/styles/scss');
    this.template('_main.scss', 'public/styles/scss/main.scss');
  } else {
    this.copy('_main.css', 'public/styles/main.css');
  }
};

SandboxGenerator.prototype.gulpfile = function gulpfile() {
  this.template('_gulpfile.js', 'gulpfile.js');
};

SandboxGenerator.prototype.packageJSON = function packageJSON() {
  // Generate package.json
  var _packageJSON = require('./templates/_package.json');
  _packageJSON.name = this.appName;

  // Add dev-dependencies
  _packageJSON.devDependencies['gulp'] = '*';
  if (this.includeScss === true) {
    _packageJSON.devDependencies['gulp-ruby-sass'] = '*';
  }
  _packageJSON.devDependencies['gulp-jshint'] = '*';
  _packageJSON.devDependencies['gulp-open'] = '*';
  _packageJSON.devDependencies['gulp-livereload'] = '*';
  _packageJSON.devDependencies['gulp-notify-growl'] = '*';
  _packageJSON.devDependencies['gulp-connect'] = '*';
  _packageJSON.devDependencies['wiredep'] = '*';
  // Write to file
  this.write("package.json", this._prettyJSON(_packageJSON));
};

SandboxGenerator.prototype.bower = function bower() {
  // Generate bower.json
  var _bowerJSON = require('./templates/_bower.json');
  _bowerJSON.name = this.appName;

  // Add dependencies
  if (this.includeAngular === true) {
    _bowerJSON.dependencies['angular'] = '*';
  }
  if (this.includeLodash === true) {
    _bowerJSON.dependencies['lodash'] = '*';
  }
  if (this.includeNormalizeCss === true) {
    _bowerJSON.dependencies['normalize.css'] = '*';
  }
  if (this.includeCsswizardryGrids === true) {
    _bowerJSON.dependencies['csswizardry-grids'] = '*';
  }
  if (this.includeBourbon === true) {
    _bowerJSON.dependencies['bourbon'] = '*';
  }
  // Write to file
  this.write("bower.json", this._prettyJSON(_bowerJSON));
  this.copy('bowerrc', '.bowerrc');
};

SandboxGenerator.prototype.jsHint = function jsHint() {
  this.template('jshintrc', '.jshintrc');
};

SandboxGenerator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

SandboxGenerator.prototype.git = function git() {
  this.copy('gitattributes', '.gitattributes');
  this.template('gitignore', '.gitignore');
};

SandboxGenerator.prototype.readme = function readme() {
  this.template('_README.md', 'README.md');
};
