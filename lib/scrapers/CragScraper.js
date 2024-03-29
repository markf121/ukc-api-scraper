var Vow = require('vow'),
    util = require('util');

module.exports = function (Scraper, CragRequester, CragSaver, GradeUtils, logger) {
  var requester = new CragRequester();

  function CragScraper (models) {
    Scraper.apply(this, [requester]);

    this.models = models;
    this.log = logger.child({'class': 'CragScraper'});
  }
  util.inherits(CragScraper, Scraper);


  CragScraper.prototype.scrape = function (id) {
    this._promise = Vow.promise();
    this.id = id;

    this.log.info('Scraping Crag: ' + id);

    this._scrape(id).then(
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
    var id = parseInt(this.id, 10);

    $('#main > div').first().remove();
    var data = {
      _id: id,
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
      isHill: CragScraper.scrapeIsHill(climbs),
      totalClimbs: CragScraper.scrapeTotalClimbs($),
      totalStars: CragScraper.scrapeTotalStars(climbs),
      rockType: CragScraper.scrapeRockType($),
      faces: CragScraper.scrapeFaces($),
      altitude: CragScraper.scrapeAltitude($),
      isTidal: CragScraper.scrapeIsTidal($),
      comments: CragScraper.scrapeComments($),
      moderator: CragScraper.scrapeModerator($),
      isModerated: CragScraper.isModerated(markup),
      photos: Scraper.scrapeCarouselPhotos($, id)
    };

    this.log.info('Crag scraped');

    //this._promise.fulfill(data);
    //return;

    var self = this;
    var saver = new CragSaver(data, this.models);
    saver.save().then(function (crag) {
      self._promise.fulfill(crag);
    }, this._fail, null, this);
  };

  CragScraper.prototype._fail = function (err) {
    this.log.error(err);
    this._promise.reject(err);
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
      var isbnRegex = / \(?ISBN ([\d\sX]+?)\)? map$/;
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

    var geo = [];
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
    var matches = markup.match(new RegExp('title=\'List crags in this area\'>[\\w\\W]+</a>, ([\\w ]+)'));
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
          book.published = $year.text() || null;

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

  CragScraper.scrapeTotalStars = function (climbs) {
    var stars = 0;
    climbs.forEach(function (climb) {
      stars += climb.stars || 0;
    });

    return stars;
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

  CragScraper.scrapeModerator = function ($) {
    var moderator = null;

    $('b').each(function (i, el) {
      var $el = $(el);
      if ($el.text() !== 'Moderator') {
        return;
      }

      var $p = $el.parent();
      $el.remove();
      var matches = $p.find('a').attr('href').match(/(\d+)$/);
      moderator = {
        name: $p.find('b').last().text(),
        id: parseInt(matches[1], 10)
      };

    });

    return moderator;
  };

  CragScraper.isModerated = function (markup) {
    return !markup.match(/This Crag is waiting to be checked by the UKC Logbook editor, and should be available shortly./);
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

      if ($row.text().match(/Add missing Climbs/)) {
        return;
      }

      var climb = {
        position: position,
        name: Scraper.decodeEntities($a.text()) || null,
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

      var $redFont = $row.find('font[color=red]');
      if ($redFont.length) {
        climb.moderated = false;
        if ($redFont.text().match(/†/)) {
          climb.verified = false;
        }
      }

      if (currentButtress) {
        climb.buttress = currentButtress;
      }

      climb.rawGrade = $row.find('td[nowrap=nowrap]').text().trim();
      var grade = GradeUtils.parseRawGrade(climb.rawGrade);

      climb.ukTechGrade = grade.ukTechGrade;
      climb.stars = grade.stars;
      climb.grade = grade;
      climb.climbType = grade.climbType;

      climb.totalTicks = parseInt($row.find('td').last().text(), 10) || 0;

      climbs.push(climb);
      position += 1;
    });

    return climbs;
  };

  CragScraper.scrapeIsHill = function (climbs) {
    return (climbs.length === 1 && climbs[0].climbType === 11);
  };

  CragScraper.scrapeComments = function ($) {
    var $td = $('table[cellpadding="5"][bgcolor="#eeeeee"] td').first().clone(),
        comments = [],
        comment;

    function scrapeComment ($el) {
      var $font = $el.find('font'),
          $a = $font.find('a'),
          parts = $font.text().split(' - '),
          comment = null;

      if (!$font.length) {
        return;
      }

      comment = {
        userName: parts[0].trim(),
        ukcCreated: Scraper.scrapeDate(parts[1])
      };

      if ($a.length) {
        comment.user = parseInt($a.attr('href').match(/(\d+)$/)[1], 10);
      }

      $font.remove();

      comment.comment = Scraper.decodeEntities($el.text().trim());

      return comment;
    }

    $td.find('table').remove();

    $td.find('p').each(function (i, el) {
      var $el = $(el),
          comment = scrapeComment($el);

      if (comment) {
        comments.push(comment);
      }

      $el.remove();
    });

    comment = scrapeComment($td);
    if (comment) {
      comments.unshift(comment);
    }

    return comments;
  };

  return CragScraper;
};