'use strict';

var yeoman = require('yeoman-generator');
var util = require('util');
var path = require('path');
var chalk = require('chalk');
var _ = require('lodash');
var npmLatest = require('npm-latest');
var bowerLatest = require('bower-latest');

var SandboxGenerator =  module.exports = function SandboxGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  this.options = _.merge(this.options, {
    reqTimeout : 15000
  });
  _.merge(this.options, options);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });
};

util.inherits(SandboxGenerator, yeoman.generators.Base);

SandboxGenerator.prototype._stringifyPrettyJSON = function _stringifyPrettyJSON(obj) {
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
      name: 'Normalize.scss',
      value: 'includeNormalizeScss',
      checked: false
    }, {
      name: 'Csswizardry-grids',
      value: 'includeCsswizardryGrids',
      checked: false
    },
    {
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
    this.includeNormalizeScss = hasFeature('includeNormalizeScss');
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
  var cb = this.async();

  // Generate package.json
  var _packageJSON = require(path.join(__dirname + '/templates/_package.json'));
  _packageJSON.name = this.appName;

  var npmList = [];

  // Add dev-dependencies
  npmList.push('gulp');
  if (this.includeScss === true) {
    npmList.push('gulp-ruby-sass');
  }
  npmList.push('gulp-jshint');
  npmList.push('gulp-jscs');
  npmList.push('gulp-open');
  npmList.push('gulp-livereload');
  npmList.push('gulp-notify-growl');
  npmList.push('gulp-connect');
  npmList.push('wiredep');

  var count = npmList.length;

  if (count === 0) {
    return cb();
  }

  var that = this;
  _.each(npmList, function (packageName) {
    npmLatest(packageName, {timeout: that.options.reqTimeout}, function (err, result) {
      if (!err && result.name && result.version) {
        _packageJSON.devDependencies[result.name] = result.version;
      } else {
        // take the latest
        _packageJSON.devDependencies[packageName] = '*';
      }
      if (!--count) {
        // Write to file
        this.write('package.json', this._stringifyPrettyJSON(_packageJSON));
        cb();
      }
    }.bind(this));
  }, this);

};

SandboxGenerator.prototype.bower = function bower() {

  var cb = this.async();

  // Generate bower.json
  var _bowerJSON = require(path.join(__dirname + '/templates/_bower.json'));
  _bowerJSON.name = this.appName;

  var bowerList = [];
  // Add dependencies
  if (this.includeAngular === true) {
    bowerList.push('angular');
  }
  if (this.includeLodash === true) {
    bowerList.push('lodash');
  }
  if (this.includeNormalizeScss === true) {
    bowerList.push('normalize.scss');
  }
  if (this.includeCsswizardryGrids === true) {
    bowerList.push('csswizardry-grids');
  }
  if (this.includeBourbon === true) {
    bowerList.push('bourbon');
  }

  var count = bowerList.length;

  if (count === 0) {
    this.write('bower.json', this._stringifyPrettyJSON(_bowerJSON));
    this.copy('bowerrc', '.bowerrc');
    return cb();
  }

  var that = this;
  _.each(bowerList, function (packageName) {
    bowerLatest(packageName, {timeout: that.options.reqTimeout}, function (result) {
      if (result && result.name && result.version) {
        _bowerJSON.dependencies[result.name] = result.version;
      } else {
        // take the latest
        _bowerJSON.dependencies[packageName] = '*';
      }
      if (!--count) {
        // Write to file
        that.write('bower.json', that._stringifyPrettyJSON(_bowerJSON));
        that.copy('bowerrc', '.bowerrc');
        cb();
      }
    });
  });
};

SandboxGenerator.prototype.jsHint = function jsHint() {
  this.template('jshintrc', '.jshintrc');
};

SandboxGenerator.prototype.jscsJson = function jscsJson() {
  this.copy('jscs.json', '.jscs.json');
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
