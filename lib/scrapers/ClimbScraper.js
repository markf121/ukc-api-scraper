var util = require('util'),
    Vow = require('vow');

module.exports = function (Scraper, ClimbRequester, CragScraper, ClimbSaver, GradeUtils, logger) {
  var requester = new ClimbRequester();

  var totalsRegex = />This climb is in (\d+) logbooks?, and on (\d+) wishlists?\.<\/font>/;

  var gradeVoteOptions = [
      'hardHarderGrade',
      'harderGrade',
      'easyHarderGrade',
      'hardSameGrade',
      'sameGrade',
      'easySameGrade',
      'hardEasierGrade',
      'easierGrade',
      'easyEasierGrade'
  ];

  var starsVoteOptions = [
      'stars3',
      'stars2',
      'stars1',
      'stars0',
      'bagOfShite'
  ];

  var ascentsMap = {
    Soloed: 'soloed',
    Lead: 'lead',
    Followed: 'followed',
    'Alt Leads': 'alternateLeads',
    Toproped: 'toproped',
    Unknown: 'unknown',
    Bouldered: 'bouldered',
    '\'Climbed\'': 'climbed',
    'clean O/S': 'onsight',
    'clean β': 'flash',
    'clean rpt': 'repeat',
    'clean RP': 'redpoint',
    'dnf': 'didNotFinish',
    dogged: 'dogged'
  };

  function scrapeFirstAscentData ($) {
    var $fa = $('#main table table tr:nth-child(7) font[color=#666666][size=1]').first();
        fa = $fa.text();

    if (!$fa.length || $fa.parent()[0].name === 'p') {
      return null;
    }

    if ($fa.parent()[0].name === 'div' || fa.match(/^Photo:/) || !fa.trim()) {
      fa = null;
    }

    return fa;
  }

  function scrapeDescription ($, getGuidebookDescription) {
    var $container = $('#main table table tr:nth-child(7)').first().find('td').first().clone(),
        paras = [],
        containerText,
        description = null,
        hasGuidebookDescription = false,
        cancelDescription = false;

    $container.find('tr').remove();

    if ($container.length) {
      $container.children().each(function (i, el) {
        var $el = $(el),
            text,
            isCopyright = false;
        if ($el[0].name === 'i' && $el.text().match(/No description has been contributed for this climb/)) {
          cancelDescription = true;
          return false;
        } else if ($el[0].name === 'p') {
          text = $el.text();
          if (!text.match(/^\s[Ticklists:|Photo:]/)) {
            if (hasGuidebookDescription) {
              if (!getGuidebookDescription) {
                paras.push(Scraper.cleanupParagraphText(text));
              }
            } else {
              paras.push(Scraper.cleanupParagraphText(text));
            }
          }
        } else if ($el[0].name === 'font' && $el.text().match(/^\u00a9/)) {
          hasGuidebookDescription = true;
          isCopyright = true;
          if (!getGuidebookDescription) {
            paras = [];
          }
        }

        if (!isCopyright) {
          $el.remove();
        }
      });

      if (cancelDescription) {
        return null;
      }

      if (!hasGuidebookDescription && getGuidebookDescription) {
        return null;
      }

      containerText = $container.html();

      if (getGuidebookDescription) {
        containerText = containerText.split('<font ')[0];
      } else if (hasGuidebookDescription) {
        containerText = containerText.split('</font>')[1];
      }

      paras.unshift(Scraper.cleanupParagraphText(containerText));

      description = paras.join('\n\n');
      description = description.trim() || null;
    }

    return description;
  }

  function ClimbScraper (models) {
    Scraper.apply(this, [requester]);

    this.models = models;
    this.log = logger.child({'class': 'ClimbScraper'});
  }
  util.inherits(ClimbScraper, Scraper);

  ClimbScraper.prototype.scrape = function (id) {
    this._promise = Vow.promise();
    this.id = id;

    this._scrape(id).then(
      this._success,
      this._fail,
      null,
      this
    );

    return this._promise;
  };

  ClimbScraper.scrapeName = function ($) {
    return $('#main tr:nth-child(2)').first().find('b').first().text();
  };

  ClimbScraper.scrapeGrade = function ($) {
    var rawGrade = $('#main td[align=right] b').first().text().trim();
    return GradeUtils.parseRawGrade(rawGrade);
  };

  ClimbScraper.scrapeStars = function ($) {
    var stars = 0,
        img = $('#main img').first();

    if (img.length) {
      stars = img.attr('alt').length;
    }

    return stars;
  };

  ClimbScraper.scrapeCrag = function ($) {
    var match = $('#main td').first().find('a').attr('href').match(/(\d+)$/);

    return match ? parseInt(match[1], 10) : null;
  };

  ClimbScraper.scrapeDescription = function ($) {
    return scrapeDescription($, false);
  };

  ClimbScraper.scrapeGuidebookDescription = function ($) {
    return scrapeDescription($, true);
  };

  ClimbScraper.scrapeGuidebookPublisher = function ($) {
    var font = $('#main font[size=1]').first().text(),
        match = font.match(/^\u00a9\s(.*?)$/);

    return match ? match[1] : null;
  };

  ClimbScraper.scrapeHeight = function ($) {
    var font = $('#main font[color=#666666]').first().text(),
        match = font.match(/^(\d+)m[\.|,]/);

    return match ? parseInt(match[1], 10) : null;
  };

  ClimbScraper.scrapePitches = function ($) {
    var font = $('#main font[color=#666666]').first().text(),
        match = font.match(/(\d+) pitches\.$/);

    return match ? parseInt(match[1], 10) : null;
  };

  ClimbScraper.scrapeFirstAscentionists = function ($) {
    var fa = scrapeFirstAscentData($);

    if (fa) {
      fa = fa.replace(Scraper.dateRegex, '').trim();
      fa = fa.replace(/^FA\. /, '').trim();
      fa = fa.replace(/\d{1,2}\.\d{1,2}\.\d{1,2}$/, '').trim();
    }

    return fa;
  };

  ClimbScraper.scrapeFirstAscentDate = function ($) {
    var fa = scrapeFirstAscentData($),
        date = Scraper.scrapeDate(fa);

    return date;
  };

  ClimbScraper.scrapeTotalTicks = function (markup) {
    var matches = markup.match(totalsRegex);

    if (matches) {
      return parseInt(matches[1], 10);
    }

    return null;
  };

  ClimbScraper.scrapeTicks = function ($) {

  };

  ClimbScraper.scrapeTicklists = function ($) {
    var $container = $('#main table table tr:nth-child(7)').first().find('td').first(),
        lists = [];

    if ($container.length) {
      $container.children().each(function (i, el) {
        var $el = $(el),
            $links;

        if ($el[0].name === 'p' && $el.text().match(/^[\s+]?Ticklists\:/)) {
          $el.find('a').each(function (i, a) {
            var $a = $(a),
                matches = $a.attr('href').match(/set\.php\?id=(\d+)$/);

            if (matches) {
              lists.push({
                _id: parseInt(matches[1], 10),
                title: $a.text()
              });
            }
          });
        }
      });
    }

    return lists || null;
  };

  ClimbScraper.scrapeTotalWishlists = function (markup) {
    var matches = markup.match(totalsRegex);

    if (matches) {
      return parseInt(matches[2], 10);
    }

    return null;
  };

  ClimbScraper.scrapeWishlists = function ($) {

  };

  ClimbScraper.scrapeAscents = function ($) {
    var $trs = $('table[width="140"] tr'),
        ascents = {};

    $trs.each(function (i, tr) {
      var $tr = $(tr),
          key = ascentsMap[$tr.find('font').first().text().trim()],
          matches;

      matches = $tr.find('img').attr('alt').match(/^(\d+) of (\d+)/);
      if (matches) {
        ascents.total = parseInt(matches[2], 10);
        ascents[key] = parseInt(matches[1], 10);
      }
    });

    return ascents;
  };

  ClimbScraper.scrapeVotes = function ($) {
    var $tables = $('table[style~="float:right"]'),
        $table,
        grades = null,
        $tr,
        total;

    function addVote (key, i, obj, $trs) {
      var $item = $trs.slice(i, i + 1).clone(),
          $font,
          matches;

      if (!$item.length) {
        return;
      }

      matches = $item.attr('title').match(/^(\d+) of (\d+)/);
      obj.total = parseInt(matches[2], 10);
      obj[key + 'Count'] = parseInt(matches[1], 10);

      if (key === 'harderGrade' || key === 'sameGrade' || key === 'easierGrade') {
        $font = $item.find('font');
        $font.find('i').remove();
        obj[key + 'Value'] = $font.text().trim();
      }
    }

    if ($tables.length) {
      votes = {
        total: parseInt(total, 10) || 0
      };
      if ($tables.length > 1) {
        $table = $tables.slice(0, 1);
        $trs = $table.find('tr[title]');
        total = $table.parent().find('center font').first().text().match(/(\d+)$/);
        votes.gradeType1 = {};

        gradeVoteOptions.forEach(function (key, i) {
          addVote(key, i, votes.gradeType1, $trs);
        });

        if ($tables.length === 3) {
          $table = $tables.slice(1, 2);
          $trs = $table.find('tr[title]');
          votes.gradeType2 = {};
          gradeVoteOptions.forEach(function (key, i) {
            addVote(key, i, votes.gradeType2, $trs);
          });
        }
      }

      votes.stars = {};
      $table = $tables.slice($tables.length - 1, $tables.length);
      $trs = $table.find('tr[title]');
      starsVoteOptions.forEach(function (key, i) {
        var $item = $trs.slice(i, i + 1).clone(),
            $font,
            matches;

        matches = $item.attr('title').match(/^(\d+) of (\d+)/);
        votes.stars.total = parseInt(matches[2], 10);
        votes.stars[key] = parseInt(matches[1], 10);
      });
    }

    return votes;
  };

  ClimbScraper.scrapeModerated = function (markup) {
    return !(markup.match(/This newly updated climb is waiting to be checked by the crag moderator/));
  };


  ClimbScraper.prototype._success = function (page) {
    var $ = page.$;
    var markup = page.markup;

    var grade = ClimbScraper.scrapeGrade($);
    var ukTechGrade = grade.ukTechGrade;
    var climbType = grade.climbType;
    var id = parseInt(this.id, 10);
    var crag = ClimbScraper.scrapeCrag($);

    delete grade.ukTechGrade;
    delete grade.climbType;
    delete grade.stars;

    var data = {
      _id: id,
      name: ClimbScraper.scrapeName($),
      crag: crag,
      description: ClimbScraper.scrapeDescription($),
      guidebookDescription: ClimbScraper.scrapeGuidebookDescription($),
      guidebookPublisher: ClimbScraper.scrapeGuidebookPublisher($),
      height: ClimbScraper.scrapeHeight($),
      pitches: ClimbScraper.scrapePitches($),
      climbType: climbType,
      grade: grade,
      ukTechGrade: ukTechGrade,
      stars: ClimbScraper.scrapeStars($),
      firstAscentionists: ClimbScraper.scrapeFirstAscentionists($),
      firstAscentDate: ClimbScraper.scrapeFirstAscentDate($),
      totalTicks: ClimbScraper.scrapeTotalTicks(markup),
      //ticks: ClimbScraper.scrapeTicks($),
      ticklists: ClimbScraper.scrapeTicklists($),
      totalWishlists: ClimbScraper.scrapeTotalWishlists(markup),
      wishlists: ClimbScraper.scrapeWishlists($),
      ascents: ClimbScraper.scrapeAscents($),
      votes: ClimbScraper.scrapeVotes($),
      moderated: ClimbScraper.scrapeModerated(markup),
      photos: Scraper.scrapeCarouselPhotos($, crag, id),
      complete: true
    };

    this.log.info('Climb scraped');

    //this._promise.fulfill(data);

    var self = this;
    var saver = new ClimbSaver(data, this.models);
    saver.save().then(function (climb) {
      self._promise.fulfill(climb);
    }, this._fail, null, this);
  };

  ClimbScraper.prototype._fail = function (err) {
    this.log.error(err);
    this._promise.reject(err);
  };

  return ClimbScraper;
};
