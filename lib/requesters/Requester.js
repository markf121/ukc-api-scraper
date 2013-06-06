var request = require('request');

module.exports = function (config) {
  var Requester = function () {

  };

  Requester.prototype = {
    request: function (params, cb) {
      var self = this;

      if (typeof params === 'string') {
        params = {
          url: params
        };
      }

      params.proxy = config.get('proxy');
      params.url = 'http://www.ukclimbing.com' + params.url;
      params.encoding = null;

      request.get(params, function (err, res, body) {
        if (res.statusCode >= 400) {
          err = new Error('Not found');
        }

        cb(err, body);
      });
    }
  };

  return Requester;
};