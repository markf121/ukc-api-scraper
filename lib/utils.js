var iconv = require('iconv'),
    request = require('request'),
    cheerio = require('cheerio'),
    entities = require('entities'),
    xml2js = require('xml2js'),
    vow = require('vow');

//request.cookie('ukcsid=11ea35ca4f7c822221338f34303fa208#111303#stevoland');

var ic = new iconv.Iconv('iso-8859-1', 'utf-8');

var decodeEntities = function (str) {
  return entities.decode(str, 1);
};

var convertToUtf8 = function (str) {
    var buf = ic.convert(str);
    return buf.toString('utf-8');
};

var requestPage = function (params, cb) {
  if (typeof params === 'string') {
    params = {
      url: params
    };
  }

  params.url = 'http://www.ukclimbing.com' + params.url;
  //params.proxy = 'http://www-cache.reith.bbc.co.uk';
  params.encoding = null;

  request.get(params, cb);
};

var fetchCountryData = function (countries, prop, cb) {
  countries.forEach(function (country) {
    console.info(country._id);
    requestPage('/logbook/livecountry.php?id=' + country._id, function (err, response, body) {
      body = convertToUtf8(body);

      var parser = new xml2js.Parser();
      parser.parseString(body, function (err, result) {
        result = result.country;
        if (result.$) {
          if (result.$.lng && result.$.lat) {
            country.geo = [
              parseFloat(result.$.lng),
              parseFloat(result.$.lat)
            ];
          }

          if (result.$.zoom) {
            country.zoom = parseInt(result.$.zoom, 10);
          }
          country.complete = true;
          country.save();
        }

        if (result[prop]) {
          result[prop].forEach(function (obj) {
            cb(obj, country);
          });
        }
      });
    });
  });
};

var scrapePage = function (params, cb) {
  var promise = vow.promise();
   requestPage(params, function (err, response, body) {
    if (err) {
      promise.reject(err);
      return;
    } else if (response.statusCode >= 400) {
      promise.reject(new Error('Not found'));
      return;
    }

    var utf8String = convertToUtf8(body);

    promise.fulfill({
      $: cheerio.load(utf8String),
      markup: utf8String
    });
  });

  return promise;
};

var cleanupParagraphText = function (text) {
  return decodeEntities(text.replace(/<br>/, "\n").trim());
};

var capitalCase = function (str) {
  var arr = str.split(' ');

  arr = arr.map(function (word) {
    return word.substr(0,1).toUpperCase() + word.substr(1).toLowerCase();
  });

  return arr.join(' ');
};

module.exports = {
  decodeEntities: decodeEntities,
  convertToUtf8: convertToUtf8,
  fetchCountryData: fetchCountryData,
  requestPage: requestPage,
  scrapePage: scrapePage,
  cleanupParagraphText: cleanupParagraphText,
  capitalCase: capitalCase
};
