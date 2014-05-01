'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var expect = require('chai').expect;

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

  describe('_stringifyPrettyJSON()', function () {
    it('should be of type function', function () {
      expect(typeof(this.app._stringifyPrettyJSON)).to.equal('function');
    });

    it('should return pretty JSON string', function () {
      var testObj = {
        foo: 'bar'
      };
      var expectedResult = '{\n  \"foo\": \"bar\"\n}';
      expect(this.app._stringifyPrettyJSON(testObj)).to.equal(expectedResult);
    });
  });
});
