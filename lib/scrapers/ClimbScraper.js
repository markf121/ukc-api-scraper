var util = require('util'),
    Vow = require('vow');

module.exports = function (Scraper, ClimbRequester, CragScraper, GradeUtils, logger) {
  var requester = new ClimbRequester();

  var months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  var dateRegex = /(\d{1,2}\/)?(\w{3}\/)?(\d{4})$/;

  var totalsRegex = />This climb is in (\d+) logbooks?, and on (\d+) wishlists?\.<\/font>/;

  function scrapeFirstAscentData ($) {
    var $fa = $('#main table table tr:nth-child(7) font[color=#666666][size=1]').first();
        fa = $fa.text();

    if ($fa.parent()[0].name === 'div' || fa.match(/^Photo:/) || !fa.trim()) {
      fa = null;
    }

    return fa;
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
    var $container = $('#main table table tr:nth-child(7)').first().find('td').first().clone(),
        paras = [],
        description = null;

    if ($container.length) {
      $container.children().each(function (i, el) {
        var $el = $(el),
            text;
        if ($el.name === 'p') {
          text = $el.text();
          if (!text.match(/^[Ticklist|Photos]:/)) {
            paras.push(text);
          }
        }

        $el.remove();
      });

      paras.unshift($container.text().trim());

      description = paras.join('\n\n');
      description = description.trim() || null;
    }

    return description;
  };

  ClimbScraper.scrapeGuidebookPublisher = function ($) {
    var font = $('#main font[size=1]').first().text(),
        match = font.match(/\u00a9\s(.*?)$/);

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
      fa = fa.replace(dateRegex, '').trim();
      fa = fa.replace(/^FA\. /, '').trim();
      fa = fa.replace(/\d{1,2}\.\d{1,2}\.\d{1,2}$/, '').trim();
    }

    return fa;
  };

  ClimbScraper.scrapeFirstAscentDate = function ($) {
    var fa = scrapeFirstAscentData($),
        date = null;

    if (fa) {
      matches = fa.match(dateRegex);
      if (matches) {
        if (matches.length === 2) {
          date = matches[1];
        } else if (matches.length === 3) {
          date = (months.indexOf(matches[1]) + 1) + matches[2];
        } else if (matches.length === 4) {
          date = matches[1] + (months.indexOf(matches[2].substr(0, matches[2].length-1)) + 1) + '/' + matches[3];
        }
      }
    }

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

  };

  ClimbScraper.scrapeVotes = function ($) {

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

    delete grade.ukTechGrade;
    delete grade.climbType;
    delete grade.stars;

    var data = {
      _id: parseInt(this.id, 10),
      name: ClimbScraper.scrapeName($),
      crag: ClimbScraper.scrapeCrag($),
      description: ClimbScraper.scrapeDescription($),
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
      ticks: ClimbScraper.scrapeTicks($),
      ticklists: ClimbScraper.scrapeTicklists($),
      totalWishlists: ClimbScraper.scrapeTotalWishlists(markup),
      wishlists: ClimbScraper.scrapeWishlists($),
      ascents: ClimbScraper.scrapeAscents($),
      votes: ClimbScraper.scrapeVotes($),
      moderated: ClimbScraper.scrapeModerated(markup)
    };

    this.log.info('Climb scraped');

    this._promise.fulfill(data);

    /*var self = this;
    var saver = new ClimbSaver(data, this.models);
    saver.save().then(function (crag) {
      self._promise.fulfill(crag);
    }, this._fail, null, this);*/
  };

  ClimbScraper.prototype._fail = function (err) {
    this.log.error(err);
    this._promise.reject(err);
  };

  return ClimbScraper;
};
