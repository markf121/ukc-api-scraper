var iconv = require('iconv'),
    cheerio = require('cheerio'),
    entities = require('entities'),
    Vow = require('vow');

var ic = new iconv.Iconv('iso-8859-1', 'utf-8');

module.exports = function () {
  function Scraper (requester) {
    this.requester = requester;
  }

  Scraper.decodeEntities = function (str) {
    return entities.decode(str, 1);
  };

  Scraper.encodeEntities = function (str) {
    return entities.encode(str, 1);
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

  Scraper.pairScraper = function ($, func) {
    var pairs = $('#main p').first().text().split('–');
    var ret = null;
    pairs.forEach(function (pair, i) {
      var parts = pair.trim().split(' ');
      var prop = parts.shift().toLowerCase().trim();
      var val = parts.join(' ').trim();

      if (val === '?' || val === 'UNKNOWN') {
        val = null;
      } else {
        var funcRet = func(prop, val);
        if (funcRet !== undefined) {
          ret = funcRet;
          return false;
        }
      }
    });
    return ret;
  };

  Scraper.scrapeUkcUpdated = function ($) {
    var lastUpdated = null;
    var $font = $('#main font[size=1]');

    $font.each(function (i, el) {
      matches = $(el).text().match(/These details were last updated on ([\d]{1,2}\/[\w]{3,4}\/[\d]{4})$/);
      if (matches) {
        var date = new Date(Date.parse(matches[1]));
        var month = date.getMonth().toString();
        month = (month.length == 1) ? '0' + month : month;
        var day = date.getDate().toString();
        day = (day.length == 1) ? '0' + day : day;
        lastUpdated = date.getFullYear() + '-' + month + '-' + day;
      }
    });

    return lastUpdated;
  };


  Scraper.prototype = {
    _scrape: function (params) {
      var promise = Vow.promise();

      this.requester.request(params, function (err, body) {
        if (err) {
          promise.reject(err);
          return;
        }

        var utf8String = Scraper.convertToUtf8(body);
        // Fix EG: http://www.ukclimbing.com/logbook/book.php?id=15
        utf8String = utf8String.replace(/<TABLE/, '<table');

        promise.fulfill({
          $: cheerio.load(utf8String),
          markup: utf8String
        });
      });

      return promise;
    },

    _save: function (data) {
      var self = this;

      var id = data._id;
      delete data._id;
      this.model.findOneAndUpdate(
        {
          _id: id
        }, data, {
          upsert: true
        }, function (err, instance) {
          if (err) {
            self._promise.reject(err);
            return;
          }
          instance._id = id;
          instance.save();
          self._promise.fulfill(instance);
        }
      );
    }
  };

  return Scraper;
};