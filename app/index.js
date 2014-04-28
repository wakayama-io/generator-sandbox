'use strict';

var yeoman = require('yeoman-generator');
var util = require('util');
var path = require('path');
var chalk = require('chalk');

var SandboxGenerator =  module.exports = function SandboxGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  this.pkg = require('../package.json');
  this.options = options;

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });
};

util.inherits(SandboxGenerator, yeoman.generators.Base);

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
    message: 'Which SCSS libraries would you like to include?',
    choices: [{
      name: 'Bourbon',
      value: 'includeBourbon',
      checked: false
    }, {
      name: 'Neat',
      value: 'includeNeat',
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
    this.includeBourbon = hasFeature('includeBourbon');
    this.includeNeat = hasFeature('includeNeat');

    done();
  }.bind(this));
};

SandboxGenerator.prototype.gulpfile = function gulpfile() {
  this.template('_gulpfile.js', 'gulpfile.js');
};

SandboxGenerator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
};

SandboxGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.template('_bower.json', 'bower.json');
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
