# generator-sandbox
[![NPM version](https://badge.fury.io/js/generator-sandbox.svg)](http://badge.fury.io/js/generator-sandbox)
[![Build Status](https://secure.travis-ci.org/wakayama-io/generator-sandbox.png?branch=master)](https://travis-ci.org/wakayama-io/generator-sandbox)
[![Dependency Status](https://david-dm.org/wakayama-io/generator-sandbox.svg)](https://david-dm.org/wakayama-io/generator-sandbox)
[![Coverage Status](https://coveralls.io/repos/wakayama-io/generator-sandbox/badge.png?branch=master)](https://coveralls.io/r/wakayama-io/generator-sandbox?branch=master)

## Features
* [Gulp](http://gulpjs.com/)
* [Built-in preview server](http://www.senchalabs.org/connect/)
* [LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en)
* [Growl Notifications](http://growl.info/)
* [JSHint](http://www.jshint.com/)
* [Jscs](https://github.com/mdevils/node-jscs#configuration)
* [Wiredep](https://github.com/taptapship/wiredep)

## Optional
* [AngularJS](https://angularjs.org/),
* [Angular-cookies](https://docs.angularjs.org/api/ngCookies)
* [Angular-loader](http://docs.angularjs.org/guide/bootstrap)
* [Angular-resource](https://docs.angularjs.org/api/ngResource)
* [Angular-sanitize](https://docs.angularjs.org/api/ngSanitize)
* [Angular-route](https://docs.angularjs.org/api/ngRoute)
* [Angular-ui-router](https://github.com/angular-ui/ui-router)
* [Lo-Dash](http://lodash.com/)
* [Scss](http://sass-lang.com/)
* [Inuit.css](https://github.com/csswizardry/inuit.css/)
* [Normalize.scss](https://github.com/hail2u/normalize.scss)
* [Csswizardry Grids](https://github.com/csswizardry/csswizardry-grids)

### AngularJS
##### Included Features
* Testing with [Karma](http://karma-runner.github.io/0.12/index.html) and [Jasmine](http://jasmine.github.io/)
* compatible with sub-generators of [generator-angular](https://github.com/yeoman/generator-angular)

##### Angular Sub-Generators
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

## Dependencies
* [Node.js](http://nodejs.org/)
* [Yeoman](http://yeoman.io/)
* [Bower](http://bower.io/)
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
* `--skip-welcome-message`
  Skips the welcome message.

## Contributors
- [Koji Wakayama](https://github.com/kojiwakayama)
- [Kentaro Wakayama](https://github.com/kwakayama)

## License
Copyright (c) 2014 Koji Wakayama. Licensed under the [BSD license](http://opensource.org/licenses/bsd-license.php).

