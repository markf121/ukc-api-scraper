var iconv = require('iconv'),
    request = require('request'),
    cheerio = require('cheerio'),
    entities = require('entities'),
    Vow = require('vow');

var ic = new iconv.Iconv('iso-8859-1', 'utf-8');

function Scraper () {
}

Scraper.decodeEntities = function (str) {
  return entities.decode(str, 1);
};

Scraper.convertToUtf8 = function (str) {
    var buf = ic.convert(str);
    return buf.toString('utf-8');
};

Scraper.cleanupParagraphText = function (text) {
  return Scraper.decodeEntities(text.replace(/<br>/, "\n").trim());
};

Scraper.capitalCase = function (str) {
  var arr = str.split(' ');

  arr = arr.map(function (word) {
    return word.substr(0,1).toUpperCase() + word.substr(1).toLowerCase();
  });

  return arr.join(' ');
};

Scraper.getTextForBoldTitle = function ($el) {
  var $p;
  var text;
  var arr = [];
  $p = $el.parent();
  $el.remove();

  while ($p[0] &&
      $p[0].name.toLowerCase() === 'p' &&
      !$p.find('b').length) {

    // Hack for unescaped <
    // http://www.ukclimbing.com/logbook/crag.php?id=338
    if ($p.find('p').length) {
      $p.after($p.find('p').remove());
    }

    text = $p.text().trim();
    if (text) {
      arr.push(text);
    }
    $p = $p.next();
  }

  return Scraper.decodeEntities(arr.join("\n\n"));
};


Scraper.prototype = {
  request: function (params, cb) {
    if (typeof params === 'string') {
      params = {
        url: params
      };
    }

    params.url = 'http://www.ukclimbing.com' + params.url;
    params.encoding = null;

    request.get(params, cb);
  },

  _scrape: function (params) {
    var promise = Vow.promise();

    this.request(params, function (err, response, body) {
      if (err) {
        promise.reject(err);
        return;
      } else if (response.statusCode >= 400) {
        promise.reject(new Error('Not found'));
        return;
      }

      var utf8String = Scraper.convertToUtf8(body);

      promise.fulfill({
        $: cheerio.load(utf8String),
        markup: utf8String
      });
    });

    return promise;
  }
};

module.exports = Scraper;