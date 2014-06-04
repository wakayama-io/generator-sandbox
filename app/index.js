'use strict';

var yeoman = require('yeoman-generator'),
  util = require('util'),
  path = require('path'),
  chalk = require('chalk'),
  _ = require('lodash'),
  npmLatest = require('npm-latest'),
  bowerLatest = require('bower-latest');

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
  if (!this.options['skip-welcome-message']) {
    this.log(this.yeoman);
    this.log(chalk.magenta('Welcome to the Sandbox generator.'));
  }
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
    }, {
      name: 'Gulpicon',
      value: 'includeGulpicon',
      checked: false
    }]
  }, {
    when: function (answers) {
      return answers.basicFeatures.indexOf('includeAngular') !== -1;
    },
    type: 'checkbox',
    name: 'angularFeatures',
    message: 'Which Angular features would you like to include?',
    choices: [{
      name: 'angular-resource.js',
      value: 'includeAngularResource',
      checked: false
    }, {
      name: 'angular-cookies.js',
      value: 'includeAngularCookies',
      checked: false
    }, {
      name: 'angular-sanitize.js',
      value: 'includeAngularSanitize',
      checked: false
    }, {
      name: 'angular-route.js',
      value: 'includeAngularRoute',
      checked: false
    }, {
      name: 'angular-ui-route.js',
      value: 'includeAngularUiRouter',
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
      name: 'Inuit.css',
      value: 'includeInuitCss',
      checked: false
    },
      new yeoman.inquirer.Separator(),
    {
      name: 'Normalize.scss',
      value: 'includeNormalizeScss',
      checked: false
    }, {
      name: 'Csswizardry-grids',
      value: 'includeCsswizardryGrids',
      checked: false
    }]
  }];

  this.prompt(prompts, function (answers) {
    this.appName = this._.trim(answers.appName);
    this.slugName = this._.slugify(this.appName);
    this.camelName = this._.camelize(this.appName);

    var features = answers.basicFeatures.concat(answers.angularFeatures).concat(answers.scssFeatures);

    function hasFeature(feat) {
      return features.indexOf(feat) !== -1;
    }
    this.includeAngular = hasFeature('includeAngular');
    this.includeAngularResource = hasFeature('includeAngularResource');
    this.includeAngularCookies = hasFeature('includeAngularCookies');
    this.includeAngularSanitize = hasFeature('includeAngularSanitize');
    this.includeAngularRoute = hasFeature('includeAngularRoute');
    this.includeAngularUiRouter = hasFeature('includeAngularUiRouter');
    this.includeLodash = hasFeature('includeLodash');
    this.includeScss = hasFeature('includeScss');
    this.includeInuitCss = hasFeature('includeInuitCss');
    this.includeNormalizeScss = hasFeature('includeNormalizeScss');
    this.includeCsswizardryGrids = hasFeature('includeCsswizardryGrids');
    this.includeGulpicon = hasFeature('includeGulpicon');

    done();
  }.bind(this));
};

SandboxGenerator.prototype.app = function app() {
  this.mkdir('public');
  this.mkdir('public/scripts');
  this.mkdir('public/styles');

  this.template('_index.html', 'public/index.html');
  this.template('_app.js', 'public/scripts/app.js');

  if (this.includeScss) {
    this.mkdir('public/styles/css');
    this.mkdir('public/styles/scss');
    this.template('_main.scss', 'public/styles/scss/main.scss');
  } else {
    this.copy('_main.css', 'public/styles/main.css');
  }
};

SandboxGenerator.prototype.wireDep = function wireDep() {
  var scriptExcludes = [];
  if (this.includeAngular === true) {
    scriptExcludes.push(/angular\//);
  }
  if (this.includeLodash === true) {
    scriptExcludes.push(/lodash\//);
  }
  this.wiredepScriptExcludes = scriptExcludes.join(', ');

  var scssExcludes = [];
  if (this.includeInuitCss === true) {
    scssExcludes.push(/inuit.css\//);
  }
  if (this.includeNormalizeScss === true) {
    scssExcludes.push(/modularized-normalize-scss\//);
  }
  if (this.includeCsswizardryGrids === true) {
    scssExcludes.push(/csswizardry-grids\//);
  }
  this.wiredepScssExcludes = scssExcludes.join(', ');
};

SandboxGenerator.prototype.gulpfile = function gulpfile() {
  this.template('_gulpfile.js', 'gulpfile.js');
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

SandboxGenerator.prototype.gulpicon = function gulpicon() {
  if (this.includeGulpicon === true) {
    this.mkdir('public/images');
    this.mkdir('public/images/icons');
    this.mkdir('public/images/icons/src');
    this.mkdir('public/images/icons/templates');
    this.copy('_gulpicon-styles.hbs', 'public/images/icons/templates/gulpicon-styles.hbs');
    this.copy('_gulpicon-preview.hbs', 'public/images/icons/templates/gulpicon-preview.hbs');
    this.mkdir('public/images/icons/lib/');
    this.copy('_gulpicon-img-stats.js', 'public/images/icons/lib/img-stats.js');
    this.copy('_gulpicon-helper.js', 'public/images/icons/lib/gulpicon-helper.js');
    this.copy('_gulpicon-loader.js', 'public/images/icons/lib/gulpicon-loader.js');
  }
};

SandboxGenerator.prototype.packageJSON = function packageJSON() {
  var cb = this.async();

  // Generate package.json
  var _packageJSON = require(path.join(__dirname + '/templates/_package.json'));
  _packageJSON.name = this.slugName;

  var npmList = [];

  // Add dev-dependencies
  npmList.push('gulp');
  if (this.includeScss === true) {
    npmList.push('gulp-ruby-sass');
    npmList.push('gulp-csso');
  }
  npmList.push('gulp-load-plugins');
  npmList.push('gulp-util');
  npmList.push('gulp-plumber');
  npmList.push('gulp-jshint');
  npmList.push('gulp-jscs');
  npmList.push('jshint-stylish');
  npmList.push('gulp-open');
  npmList.push('gulp-livereload');
  npmList.push('gulp-notify-growl');
  npmList.push('connect');
  npmList.push('serve-static');
  npmList.push('morgan');
  npmList.push('wiredep');
  if (this.includeAngular === true) {
    npmList.push('generator-angular');
    npmList.push('karma');
    npmList.push('karma-jasmine');
    npmList.push('karma-chrome-launcher');
    npmList.push('lodash');
  }
  if (this.includeGulpicon === true) {
    npmList.push('q');
    npmList.push('directory-encoder');
    npmList.push('gulp-svgmin');
    npmList.push('gulp-clean');
    npmList.push('svg-to-png');
    npmList.push('gulp-filter');
    npmList.push('gulp-rename');
    npmList.push('xmldom');
    npmList.push('handlebars');
    npmList.push('lodash');
    npmList.push('event-stream');
    npmList.push('uglify-js');
  }

  var count = npmList.length;

  if (count === 0) {
    return cb();
  }

  var that = this;
  _.each(npmList, function (packageName) {
    npmLatest(packageName, {timeout: that.options.reqTimeout}, function (err, result) {
      var name = packageName;
      var version = '*';
      if (!err && result.name && result.version) {
        name = result.name;
        version = result.version;
      }
      _packageJSON.devDependencies[name] = version;
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
  _bowerJSON.name = this.slugName;

  if (this.includeAngular === true) {
    _bowerJSON.appPath = 'public';
    _bowerJSON.testPath = 'test/client/specs';
  }

  // Add dependencies
  var bowerDependencies = [];
  var bowerDevDependencies = [];

  if (this.includeAngular === true) {
    bowerDependencies.push('angular');
    bowerDevDependencies.push('angular-mocks');
    bowerDevDependencies.push('angular-scenario');
    if (this.includeAngularResource === true) {
      bowerDependencies.push('angular-resource');
    }
    if (this.includeAngularCookies === true) {
      bowerDependencies.push('angular-cookies');
    }
    if (this.includeAngularSanitize === true) {
      bowerDependencies.push('angular-sanitize');
    }
    if (this.includeAngularRoute === true) {
      bowerDependencies.push('angular-route');
    }
    if (this.includeAngularUiRouter === true) {
      bowerDependencies.push('angular-ui-router');
    }
  }
  if (this.includeLodash === true) {
    bowerDependencies.push('lodash');
  }
  if (this.includeNormalizeScss === true) {
    bowerDependencies.push('modularized-normalize-scss');
  }
  if (this.includeCsswizardryGrids === true) {
    bowerDependencies.push('csswizardry-grids');
  }
  if (this.includeInuitCss === true) {
    bowerDependencies.push('inuit.css');
  }

  var bowerList = bowerDependencies.concat(bowerDevDependencies);
  var count = bowerList.length;

  if (count === 0) {
    this.write('bower.json', this._stringifyPrettyJSON(_bowerJSON));
    this.copy('bowerrc', '.bowerrc');
    return cb();
  }

  var that = this;
  _.each(bowerList, function (packageName) {
    bowerLatest(packageName, {timeout: that.options.reqTimeout}, function (result) {
      var name = packageName;
      var version = '*';
      if (result && result.name && result.version) {
        name = result.name;
        version = result.version;
      }
      if (bowerDependencies.indexOf(packageName) !== -1) {
        _bowerJSON.dependencies[name] = version;
      } else {
        _bowerJSON.devDependencies[name] = version;
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
