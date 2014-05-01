'use strict';

var assert = require('assert');

describe('the sandbox generator', function () {
  it('can be required without throwing', function () {
    var app = require('../app');
    assert(app !== undefined);
  });
});
