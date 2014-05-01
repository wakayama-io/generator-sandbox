# generator-sandbox
[![NPM version](https://badge.fury.io/js/generator-sandbox.svg)](http://badge.fury.io/js/generator-sandbox)
[![Build Status](https://secure.travis-ci.org/kojiwakayama/generator-sandbox.png?branch=master)](https://travis-ci.org/kojiwakayama/generator-sandbox)
[![Dependency Status](https://david-dm.org/kojiwakayama/generator-sandbox.svg)](https://david-dm.org/kojiwakayama/generator-sandbox)
[![Coverage Status](https://coveralls.io/repos/kojiwakayama/generator-sandbox/badge.png?branch=master)](https://coveralls.io/r/kojiwakayama/generator-sandbox?branch=master)

## Features
* [AngularJS](https://angularjs.org/)
* [Lo-Dash](http://lodash.com/)
* [SCSS](http://sass-lang.com/)
* [Normalize.scss](https://github.com/JohnAlbin/normalize-scss)
* [Csswizardry Grids](https://github.com/csswizardry/csswizardry-grids)
* [Bourbon](http://bourbon.io/)
* [Gulp](http://gulpjs.com/)
* [Built-in server](http://www.senchalabs.org/connect/)
* [JSHint](http://www.jshint.com/)
* [Jscs](https://github.com/mdevils/node-jscs#configuration)
* [Wiredep](https://github.com/taptapship/wiredep)
* [LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en)
* [Growl Notifications](http://growl.info/)

## Dependencies
* [Node.js](http://nodejs.org/)
* [Yeoman](http://yeoman.io/)
* [Bower](http://bower.io/)
* [Gulp.js](http://gulpjs.com/)

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


## Contributing
Use git commit hook

```
#!/bin/sh
npm test
if [ $? -ne 0 ]; then
 echo "Tests failed, please fix code and recommit"
 exit 1
fi
exit 0
```

## License
[BSD license](http://opensource.org/licenses/bsd-license.php)

