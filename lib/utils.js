var iconv = require('iconv'),
    request = require('request'),
    cheerio = require('cheerio'),
    entities = require('entities');

request.cookie('ukcsid=11ea35ca4f7c822221338f34303fa208#111303#stevoland');

var ic = new iconv.Iconv('iso-8859-1', 'utf-8');

var decodeEntities = function (str) {
  return entities.decode(str, 1);
};

module.exports.decodeEntities = decodeEntities;

var convertToUtf8 = function (str) {
    var buf = ic.convert(str);
    return buf.toString('utf-8');
};

module.exports.convertToUtf8 = convertToUtf8;

var requestPage = function (params, cb) {
  if (typeof params === 'string') {
    params = {
      url: params
    };
  }

  params.url = 'http://www.ukclimbing.com' + params.url;
  params.proxy = 'http://www-cache.reith.bbc.co.uk';
  params.encoding = null;

  request.get(params, cb);
};

module.exports.requestPage = requestPage;

module.exports.scrapePage = function (params, cb) {
   requestPage(params, function (err, response, body) {
    if (err) {
      cb(err);
      return;
    } else if (response.statusCode >= 400) {
      cb(new Error('Not found'));
      return;
    }

    var utf8String = convertToUtf8(body);

    cb(null, cheerio.load(utf8String), utf8String);
  });
};

module.exports.cleanupParagraphText = function (text) {
  return decodeEntities(text.replace(/<br>/, "\n").trim());
};

module.exports.capitalCase = function (str) {
  var arr = str.split(' ');

  arr = arr.map(function (word) {
    return word.substr(0,1).toUpperCase() + word.substr(1).toLowerCase();
  });

  return arr.join(' ');
};
