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
  var ukcUpdated = Scraper.scrapeUkcUpdated($);

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
    maps: maps,
    bmcId: CragScraper.scrapeBmcId($),
    ukcUpdated: ukcUpdated,
    guidebooks: CragScraper.scrapeGuidebooks($),
    climbs: climbs,
    totalClimbs: CragScraper.scrapeTotalClimbs($),
    rockType: CragScraper.scrapeRockType($),
    faces: CragScraper.scrapeFaces($),
    altitude: CragScraper.scrapeAltitude($),
    isTidal: CragScraper.scrapeIsTidal($),
    updated: Date.now()
  };

  this._addReferenceToCountry()
    .then(this._addReferenceToArea, this._fail, null, this)
    .then(this._addReferenceToRockType, this._fail, null, this)
    .then(this._addReferencesToMaps, this._fail, null, this)
    .then(this._addReferencesToGuidebooks, this._fail, null, this)
    .then(this._addReferencesToClimbs, this._fail, null, this)
    .then(this._addCrag, this._fail, null, this);
};

CragScraper.prototype._fail = function (err) {
  this._promise.reject(err);
};

CragScraper.prototype._addReferenceToCountry = function () {
  var self = this;
  var promise = Vow.promise();

  this.models.Country.findOne({name: this.cragData.country}, '_id', function (err, country) {
    if (err) {
      promise.reject(err);
      return;
    }
    if (!country) {
      promise.reject(new Error('Can\'t find country'));
      return;
    }
    self.cragData.country = country._id;

    promise.fulfill(country);
  });

  return promise;
};

CragScraper.prototype._addReferenceToArea = function () {
  var self = this;
  var promise = Vow.promise();

  this.models.Area.findOne({
    name: this.cragData.area,
    country: this.cragData.country
  }, '_id', function (err, area) {
    if (err) {
      promise.reject(err);
      return;
    }
    if (!area) {
      promise.reject(new Error('Can\'t find area'));
      return;
    }
    self.cragData.area = area._id;
    promise.fulfill(area);
  });

  return promise;
};

CragScraper.prototype._addReferenceToRockType = function () {
  var self = this;
  var promise = Vow.promise();

  this.models.RockType.findOne({
    name: this.cragData.rockType
  }, '_id', function (err, rockType) {
    if (err) {
      promise.reject(err);
      return;
    }
    if (!rockType) {
      promise.reject(new Error('Can\'t find rocktype'));
      return;
    }
    self.cragData.rockType = rockType._id;
    promise.fulfill(rockType);
  });

  return promise;
};

CragScraper.prototype._addReferencesToMaps = function () {
  var promises = [];
  var self = this;

  if (this.cragData.maps) {
    this.cragData.maps.forEach(function (data, i) {
      var promise = Vow.promise();
      var id = data._id;
      delete data._id;
      promises.push(promise);
      self.models.Map.findOneAndUpdate(
        {
          _id: id
        }, data, {
          upsert: true
        }, function (err, map) {
          if (err) {
            promise.reject(err);
            return;
          }
          map._id = id;
          map.save(function (err, map) {
            if (err) {
              promise.reject(err);
              return;
            }

            self.cragData.maps[i] = id;
            promise.fulfill(map);
          });
        }
      );
    });
  }

  return Vow.all(promises);
};

CragScraper.prototype._addReferencesToGuidebooks = function () {
  var promises = [];
  var self = this;

  if (this.cragData.guidebooks) {
    this.cragData.guidebooks.forEach(function (data, i) {
      var promise = Vow.promise();
      var id = data._id;
      delete data._id;
      promises.push(promise);
      self.models.Guidebook.findOneAndUpdate(
        {
          _id: id
        }, data, {
          upsert: true
        }, function (err, book) {
          if (err) {
            promise.reject(err);
            return;
          }
          book._id = id;
          book.save(function (err, book) {
            if (err) {
              promise.reject(err);
              return;
            }

            self.cragData.guidebooks[i] = id;
            promise.fulfill(book);
          });
        }
      );
    });
  }

  return Vow.all(promises);
};

CragScraper.prototype._addReferencesToClimbs = function () {
  var promises = [];
  var self = this;

  self.cragData.climbTypes = [];
  if (this.cragData.climbs) {
    this.cragData.climbs.forEach(function (data, i) {
      if (data.climbType) {
        CragScraper.addUniqueItemToArray(self.cragData.climbTypes, data.climbType);
      }
      var promise = Vow.promise();
      var id = data._id;
      delete data._id;
      delete data.grade;
      promises.push(promise);
      self.models.Climb.findOneAndUpdate(
        {
          _id: id
        }, data, {
          upsert: true
        }, function (err, climb) {
          if (err) {
            promise.reject(err);
            return;
          }
          climb._id = id;
          climb.save(function (err, climb) {
            if (err) {
              promise.reject(err);
              return;
            }

            self.cragData.climbs[i] = id;
            promise.fulfill(climb);
          });
        }
      );
    });
  }
  self.cragData.climbTypes.sort();

  return Vow.all(promises);



  /*console.info(self.cragData.climbTypes);
  this.cragData.climbs = [];

  var promise = Vow.promise();
  promise.fulfill();

  return promise;*/
};

CragScraper.prototype._addCrag = function () {
  var self = this;
  var data = this.cragData;
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

CragScraper.addUniqueItemToArray = function (arr, item) {
  if (arr.indexOf(item) === -1) {
    arr.push(item);
  }

  return arr;
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
        map.isbn = matches[1].replace(/\D/, '');
      }

      matches = $map.attr('href').match(/item=(.*)$/);

      if (matches) {
        map._id = matches[1];
        maps.push(map);
      }

    });
  }

  return maps;
};

CragScraper.scrapeGeo = function ($) {
  var imgSrc = $('#map img').attr('src');

  var geo = null;
  var matches = imgSrc ?
    imgSrc.match(/markers=([-\d\.]+),([-\d\.]+)/) : null;

  if (matches) {
    geo = [
      parseFloat(matches[2]),
      parseFloat(matches[1])
    ];
  }

  return geo;
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

        var $year = $el.parent().find('i').first().remove();
        book.published = $year.text();

        var match = $book.attr('href').match(/([\d]+)$/);
        if (match) {
          book._id = parseInt(match[1], 10);
          guidebooks.push(book);
        }

      });

      return false;
    }
  });

  return guidebooks;
};

CragScraper.scrapeTotalClimbs = function ($) {
  return Scraper.pairScraper($, function (prop, val) {
    if (prop === 'climbs') {
      if (val !== null) {
        val = parseInt(val, 10);
      }

      return val;
    }
  });
};

CragScraper.scrapeRockType = function ($) {
  return Scraper.pairScraper($, function (prop, val) {
    if (prop === 'rocktype') {
      return val;
    }
  });
};

CragScraper.scrapeFaces = function ($) {
  return Scraper.pairScraper($, function (prop, val) {
    if (prop === 'faces') {
      return val;
    }
  });
};

CragScraper.scrapeAltitude = function ($) {
  return Scraper.pairScraper($, function (prop, val) {
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
  return Scraper.pairScraper($, function (prop, val) {
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
        climb._id = parseInt(match[1], 10);
      } else {
        return;
      }
    }

    if ($row.find('font[color=red]').length) {
      climb.moderated = false;
    }

    if (currentButtress) {
      climb.buttress = currentButtress;
    }

    climb.rawGrade = $row.find('td[nowrap=nowrap]').text().trim();
    var grade = ClimbScraper.parseRawGrade(climb.rawGrade);

    climb.ukTechGrade = grade.ukTechGrade;
    climb.stars = grade.stars;
    climb.grade = grade.grade;
    climb.climbType = grade.climbType;

    climb.totalTicks = parseInt($row.find('td').last().text(), 10) || 0;

    climbs.push(climb);
    position += 1;
  });

  return climbs;
};

module.exports = CragScraper;