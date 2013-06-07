var fs = require('fs'),
    path = require('path');

module.exports = function () {
  var FixtureRequester = function () {

  };

  FixtureRequester.prototype = {
    request: function (filename, cb) {
      var self = this,
          filePath = path.join(__dirname, '../../test/fixtures/' + filename + '.html');

      console.info(filePath);
      fs.readFile(filePath, function (err, data) {
        if (err) {
          err = new Error('Not found');
        }

        cb(err, data);
      });
    }
  };

  return FixtureRequester;
};