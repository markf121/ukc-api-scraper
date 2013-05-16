var Scraper = require('./Scraper'),
    ClimbScraper = require('./ClimbScraper'),
    util = require('util'),
    Vow = require('vow');

function CragScraper (models) {
  this.models = models;
}
util.inherits(CragScraper, Scraper);


CragScraper.prototype.scrape = function (id, params) {
  this._promise = Vow.promise();
  this.id = id;

  params.url = '/logbook/crag.php?id=' + id;

  this._scrape(params).then(
    this._success,
    this._fail,
    null,
    this
  );

  return this._promise;
};

CragScraper.prototype._success = function (page) {
  var $ = page.$;
  var markup = page.markup;

  var name = CragScraper.scrapeName($);
  var climbs = CragScraper.scrapeClimbs($);
  var maps = CragScraper.scrapeMaps($);
  var gridRef = CragScraper.scrapeGridRef($);
  var geo = CragScraper.scrapeGeo($);
  var lastUpdated = CragScraper.scrapeLastUpdated($);

  $('#main > div').first().remove();
  this.cragData = {
    _id: parseInt(this.id, 10),
    name: name,
    area: CragScraper.scrapeArea($),
    country: CragScraper.scrapeCountry($, markup),
    geo: geo,
    features: CragScraper.scrapeFeatures($),
    accessNotes: CragScraper.scrapeAccessNotes($),
    gridRef: gridRef,
    //maps: maps,
    bmcId: CragScraper.scrapeBmcId($),
    ukcUpdated: lastUpdated,
    //guidebooks: CragScraper.scrapeGuidebooks($),
    //climbs: climbs,
    totalClimbs: CragScraper.scrapeTotalClimbs($),
    //rockType: CragScraper.scrapeRockType($),
    faces: CragScraper.scrapeFaces($),
    altitude: CragScraper.scrapeAltitude($),
    isTidal: CragScraper.scrapeIsTidal($),
    updated: Date.now()
  };

  //var promises = [];

  this._addReferenceToCountry();
};

CragScraper.prototype._fail = function (err) {
  this._promise.reject(err);
};

CragScraper.prototype._addReferenceToCountry = function () {
  var self = this;

  this.models.Country.findOne({name: this.cragData.country}, '_id', function (err, country) {
    if (err) {
      self._promise.reject(err);
      return;
    }
    if (!country) {
      self._promise.reject(new Error('Can\'t find country'));
      return;
    }

    self.cragData.country = country._id;

    self._addReferenceToArea();
  });
};

CragScraper.prototype._addReferenceToArea = function () {
  var self = this;

  this.models.Area.findOne({
    name: this.cragData.area,
    country: this.cragData.country
  }, '_id', function (err, area) {
    if (err) {
      self._promise.reject(err);
      return;
    }
    if (!area) {
      self._promise.reject(new Error('Can\'t find area'));
      return;
    }
    self.cragData.area = area._id;
    self._addCrag(self.cragData, self._promise);
  });
};

CragScraper.prototype._addReferencesToMaps = function () {
  this._promise.reject(err);
};

CragScraper.prototype._addCrag = function (data, promise) {
  var self = this;

  var id = data._id;
  delete data._id;
  this.models.Crag.findOneAndUpdate(
    {
      _id: id
    }, data, {
      upsert: true
    }, function (err, crag) {
      if (err) {
        self._promise.reject(err);
        return;
      }
      crag._id = id;
      crag.save();
      self._promise.fulfill(crag);
    }
  );
};


CragScraper.scrapeName = function ($) {
  return Scraper.decodeEntities($('h1').text().trim());
};

CragScraper.scrapeGridRef = function ($) {
  var $font = $('#main font[size=1]').first();
  var gridRef = null;
  var matches;
  var maps = [];
  if ($font.length) {
    matches = $font.text().match(/Grid Ref ([\w]{2} [\d]{6})/);
    if (matches) {
      gridRef = matches[1];
    }
  }

  return gridRef;
};

CragScraper.scrapeMaps = function ($) {
  var $font = $('#main font[size=1]').first();
  var matches;
  var maps = [];
  if ($font.length) {
    var $maps = $font.first().find('i').find('a');
    var isbnRegex = / \(ISBN ([\d\s]+?)\) map$/;
    $maps.each(function (i, el) {
      var $map = $(el),
          map = {
            type: 'OS Landranger',
            number: parseInt($map.text(), 10),
            title: Scraper.decodeEntities($map.attr('title').replace(isbnRegex, ''))
          },
          matches = $map.attr('title').match(isbnRegex);

      if (matches) {
        map.isbn = matches[1];
      }

      matches = $map.attr('href').match(/item=(.*)$/);

      if (matches) {
        map.id = matches[1];
      }

      maps.push(map);
    });
  }

  return maps;
};

CragScraper.scrapeGeo = function ($) {
  var imgSrc = $('#map img').attr('src');

  var geo = imgSrc ?
    imgSrc.match(/markers=([-\d\.]+),([-\d\.]+)/) : null;

  if (geo) {
    geo.shift();
    geo[0] = parseFloat(geo[0]);
    geo[1] = parseFloat(geo[1]);
    geo = geo.slice(0, 2);
  }

  return geo;
};

CragScraper.scrapeLastUpdated = function ($) {
  var lastUpdated = null;
  var $font = $('#main font[size=1]');

  $font.each(function (i, el) {
    matches = $(el).text().match(/These details were last updated on ([\d]{1,2}\/[\w]{3,4}\/[\d]{4})$/);
    if (matches) {
      lastUpdated = new Date(Date.parse(matches[1])).toJSON();
    }
  });

  return lastUpdated;
};

CragScraper.scrapeArea = function ($) {
  return $('#main a').first().text();
};

CragScraper.scrapeCountry = function ($, markup) {
  var area = Scraper.encodeEntities(CragScraper.scrapeArea($));
  var matches = markup.match(new RegExp(area + '</a>, ([\\w ]+)'));
  var country = null;
  if (matches) {
    if (matches[1] === 'USA' || matches[1] === 'UAE') {
      country = matches[1];
    } else {
      country = Scraper.capitalCase(matches[1]);
    }
  }
  return country;
};

CragScraper.scrapeFeatures = function ($) {
  var features = null;

  $('#main b').each(function (i, el) {
    var $el = $(el);
    if ($el.text() ===  'Crag features') {
      features = Scraper.getTextForBoldTitle($el);

      return false;
    }
  });

  return features;
};

CragScraper.scrapeBmcId = function ($) {
  var bmcId = null;

  $('a').each(function (i, a) {
    var $el = $(a);
    var match = $el.attr('href').match(/http:\/\/www\.thebmc\.co\.uk\/modules\/RAD\/ViewCrag\.aspx\?id=([\d]+)$/);
    if (match) {
      bmcId = parseInt(match[1], 10);
      return false;
    }
  });

  return bmcId;
};

CragScraper.scrapeAccessNotes = function ($) {
  var accessNotes = null;

  $('#main b').each(function (i, el) {
    var $el = $(el);
    if ($el.text() === 'Access notes') {
      var $parent = $el.parent();
      var $ps = $el.parent().siblings('p');
      while ($el.prev().length) {
        var $prev = $el;
        $el = $el.prev();
        $prev.remove();
      }
      var notes = [Scraper.cleanupParagraphText($parent.html().replace(/<!--[\s\S]*-->/, ''))];
      var getParagraphContent = false;
      $ps.each(function (i, el) {
        var $el = $(el);
        if ($el.find('b').length) {
          getParagraphContent = false;
        }
        if (getParagraphContent) {
            notes.push(Scraper.cleanupParagraphText($el.text()).replace(/Read more...(.*)+$/, ''));
        }
        if ($el.find('b').text() === 'Guidebooks') {
          getParagraphContent = true;
        }
      });

      accessNotes = [];
      notes.forEach(function (line) {
        line = line.replace(/<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)<\/\1>/i, '').trim();
        if (line && !line.match(/Read more.../)) {
          accessNotes.push(Scraper.decodeEntities(line));
        }
      });
      accessNotes = accessNotes.join("\n\n");
      return false;
    }
  });

  return accessNotes;
};

CragScraper.scrapeGuidebooks = function ($) {
  var guidebooks = [];

  $('#main b').each(function (i, el) {
    var $el = $(el);
    if ($el.text() === 'Guidebooks') {
      var $books = $el.parent().find('a');
      $books.each(function (i, el) {
        var $book = $(el);
        var book = {
          title: Scraper.decodeEntities($book.text()),
          inPrint: ($book.parent()[0].name !== 'span')
        };

        var match = $book.attr('href').match(/([\d]+)$/);
        if (match) {
          book.id = parseInt(match[1], 10);
        }

        var $year = $el.parent().find('i').first().remove();
        book.year = parseInt($year.text(), 10);

        guidebooks.push(book);
      });

      return false;
    }
  });

  return guidebooks;
};

CragScraper.pairScraper = function ($, func) {
  var pairs = $('#main > p').first().text().split('–');
  var ret = null;

  pairs.forEach(function (pair, i) {
    var parts = pair.trim().split(' ');
    var prop = parts.shift().toLowerCase().trim();
    var val = parts.join(' ').trim();

    if (val === '?' || val === 'UNKNOWN') {
      val = null;
    }

    var funcRet = func(prop, val);
    if (funcRet !== undefined) {
      ret = funcRet;
      return false;
    }
  });
  return ret;
};

CragScraper.scrapeTotalClimbs = function ($) {
  return CragScraper.pairScraper($, function (prop, val) {
    if (prop === 'climbs') {
      if (val !== null) {
        val = parseInt(val, 10);
      }

      return val;
    }
  });
};

CragScraper.scrapeRockType = function ($) {
  return CragScraper.pairScraper($, function (prop, val) {
    if (prop === 'rocktype') {
      return val;
    }
  });
};

CragScraper.scrapeFaces = function ($) {
  return CragScraper.pairScraper($, function (prop, val) {
    if (prop === 'faces') {
      return val;
    }
  });
};

CragScraper.scrapeAltitude = function ($) {
  return CragScraper.pairScraper($, function (prop, val) {
    if (prop === 'altitude') {
      if (val !== null) {
        val = (val === 'Tidal') ?
          0 : parseInt(val, 10);
      }

      return val;
    }
  });
};

CragScraper.scrapeIsTidal = function ($) {
  return CragScraper.pairScraper($, function (prop, val) {
    if (prop === 'altitude') {
      if (val !== null) {
        val = (val === 'Tidal') ?
          true : false;
      }

      return val;
    }
  });
};

CragScraper.scrapeClimbs = function ($) {
  var climbs = [];
  var currentButtress;
  var position = 0;

  $('#results table.small tr').each(function (i, row) {
    var $row = $(row);
    var $a = $row.find('a');

    if ($row.attr('bgcolor') !== '#cccccc' && $row.attr('bgcolor') !== '#dddddd' && !$a.length) {
      return;
    }

    if ($row.attr('bgcolor') === '#cccccc') {
      currentButtress = Scraper.capitalCase(Scraper.decodeEntities($row.find('td.normal').text()));
      return;
    }

    var climb = {
      position: position,
      name: Scraper.decodeEntities($a.text()),
      buttress: null,
      moderated: true
    };

    if ($a.length) {
      var match = $a.attr('href').match(/([\d]+)$/);
      if (match) {
        climb.id = parseInt(match[1], 10);
      }
    }

    if ($row.find('font[color=red]').length) {
      climb.moderated = false;
    }

    if (currentButtress) {
      climb.buttress = currentButtress;
    }

    climb.rawGrade = $row.find('td[nowrap=nowrap]').text().trim();
    climb.grade = ClimbScraper.parseRawGrade(climb.rawGrade);

    climb.totalTicks = parseInt($row.find('td').last().text(), 10) || 0;

    climbs.push(climb);
    position += 1;
  });

  return climbs;
};

module.exports = CragScraper;