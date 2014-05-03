# generator-sandbox
[![NPM version](https://badge.fury.io/js/generator-sandbox.svg)](http://badge.fury.io/js/generator-sandbox)
[![Build Status](https://secure.travis-ci.org/kojiwakayama/generator-sandbox.png?branch=master)](https://travis-ci.org/kojiwakayama/generator-sandbox)
[![Dependency Status](https://david-dm.org/kojiwakayama/generator-sandbox.svg)](https://david-dm.org/kojiwakayama/generator-sandbox)
[![Coverage Status](https://coveralls.io/repos/kojiwakayama/generator-sandbox/badge.png?branch=master)](https://coveralls.io/r/kojiwakayama/generator-sandbox?branch=master)

## Features
* [Gulp](http://gulpjs.com/)
* [Built-in server](http://www.senchalabs.org/connect/)
* [LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en)
* [Growl Notifications](http://growl.info/)
* [JSHint](http://www.jshint.com/)
* [Jscs](https://github.com/mdevils/node-jscs#configuration)
* [Wiredep](https://github.com/taptapship/wiredep)

## Optional
* [AngularJS](https://angularjs.org/), compatible with sub-generators of [generator-angular](https://github.com/yeoman/generator-angular)
* [Lo-Dash](http://lodash.com/)
* [Scss](http://sass-lang.com/)
* [Inuit.css](https://github.com/csswizardry/inuit.css/)
* [Normalize.scss](https://github.com/hail2u/normalize.scss)
* [Csswizardry Grids](https://github.com/csswizardry/csswizardry-grids)

## Dependencies
* [Node.js](http://nodejs.org/)
* [Yeoman](http://yeoman.io/)
* [Bower](http://bower.io/)
* [Gulp.js](http://gulpjs.com/)
* [Sass >= 3.3.x](http://sass-lang.com/install)

## Getting Started
To install generator-sandbox from npm, run:
```
npm install -g generator-sandbox
```

## Usage
* `mkdir mysandboxapp && cd mysandboxapp` (The directory's name is your application's name)
* `yo sandbox`
* `gulp`

## Options
* `--skip-install`
  Skips the automatic execution of `bower` and `npm` after scaffolding has finished.

## Sub-Generators
Available sub-generators from [generator-angular](https://github.com/yeoman/generator-angular)

* angular:controller
* angular:directive
* angular:filter
* angular:route
* angular:service
* angular:provider
* angular:factory
* angular:value
* angular:constant
* angular:decorator
* angular:view

**Note: Generators are to be run from the root directory of your app.**

## License
[BSD license](http://opensource.org/licenses/bsd-license.php)

