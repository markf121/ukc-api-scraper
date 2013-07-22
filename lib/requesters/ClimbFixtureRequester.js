var request = require('fs'),
    path = require('path'),
    util = require('util');

module.exports = function (FixtureRequester) {
  var ClimbFixtureRequester = function () {

  };
  util.inherits(ClimbFixtureRequester, FixtureRequester);

  ClimbFixtureRequester.prototype.request = function (id, cb) {
    FixtureRequester.prototype.request.apply(this, ['climb-' + id, cb]);
  };

  return ClimbFixtureRequester;
};