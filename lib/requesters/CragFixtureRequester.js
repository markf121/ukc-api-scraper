var request = require('fs'),
    path = require('path'),
    util = require('util');

module.exports = function (FixtureRequester) {
  var CragFixtureRequester = function () {

  };
  util.inherits(CragFixtureRequester, FixtureRequester);

  CragFixtureRequester.prototype.request = function (id, cb) {
    FixtureRequester.prototype.request.apply(this, ['crag-' + id, cb]);
  };

  return CragFixtureRequester;
};