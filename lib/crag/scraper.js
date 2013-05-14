var utils = require('../utils');

function getTextForBoldTitle ($el) {
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

  return utils.decodeEntities(arr.join("\n\n"));
}

// TODO - refactor and move to a Grade module in ukc-models
function getGradeFromRawGrade (rawGrade) {
  var grade = {
    ukTechGrade: null,
    stars: null
  };

  var starsRegex = /(\*{1,3})$/;
  var matches = rawGrade.match(starsRegex);
  if (matches) {
    grade.stars = matches[1].length;
    rawGrade = rawGrade.replace(starsRegex, '').trim();
  }

  var winterRegex = /^(I|I\/II|II|II\/III|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII)/;
  matches = rawGrade.match(winterRegex);
  if (matches) {
    grade.grade = matches[1];
    grade.type = 'Scottish';
    rawGrade = rawGrade.replace(winterRegex, '').trim();
    if (rawGrade) {
      grade.ukTechGrade = rawGrade;
    }
    return grade;
  }

  var ukAdjRegex = /^(M|D|HD|VD|HVD|MS|S|HS|MVS|VS|HVS|E[\d]{1,2}|none|XS)/;
  matches = rawGrade.match(ukAdjRegex);
  if (matches) {
    grade.grade = matches[1];
    grade.type = 'British';
    rawGrade = rawGrade.replace(ukAdjRegex, '').trim();
    if (rawGrade) {
      grade.ukTechGrade = rawGrade;
      grade.climbType = 'Trad';
    } else {
      grade.climbType = 'Sport';
    }
    return grade;
  }

  var fontRegex = /^(font [3|4|5]\+?|f[6|7|8|9][A|B|C]\+?)/;
  matches = rawGrade.match(fontRegex);
  if (matches) {
    grade.grade = matches[1];
    grade.type = 'Font';
    rawGrade = rawGrade.replace(fontRegex, '').trim();
    if (rawGrade) {
      grade.ukTechGrade = rawGrade;
    }
    return grade;
  }

  var vGradesRegex = /^(VB|V[\d]{1,2}\+?)/;
  matches = rawGrade.match(vGradesRegex);
  if (matches) {
    grade.grade = matches[1];
    grade.type = 'V-grades';
    rawGrade = rawGrade.replace(vGradesRegex, '').trim();
    if (rawGrade) {
      grade.ukTechGrade = rawGrade;
    }
    return grade;
  }

  var frenchRegex = /^(F?[2|3|4|5]\+|F?[6|7|8|9][a|b|c]\+?)/;
  matches = rawGrade.match(frenchRegex);
  if (matches) {
    grade.grade = matches[1];
    grade.type = 'French';
    rawGrade = rawGrade.replace(frenchRegex, '').trim();
    if (rawGrade) {
      grade.ukTechGrade = rawGrade;
      grade.climbType = 'Trad';
    } else {
      grade.climbType = 'Sport';
    }
    return grade;
  }

  var usaRegex = /^(5\.[\d]{1,2}[abcd]?)/;
  matches = rawGrade.match(usaRegex);
  if (matches) {
    grade.grade = matches[1];
    grade.type = 'USA';
    rawGrade = rawGrade.replace(usaRegex, '').trim();
    if (rawGrade) {
      grade.ukTechGrade = rawGrade;
      grade.climbType = 'Trad';
    } else {
      grade.climbType = 'Sport';
    }
    return grade;
  }

  var iceRegex = /^(WI\d\d?\+?)/;
  matches = rawGrade.match(iceRegex);
  if (matches) {
    grade.grade = matches[1];
    grade.type = 'Ice';
    rawGrade = rawGrade.replace(iceRegex, '').trim();
    if (rawGrade) {
      grade.ukTechGrade = rawGrade;
    }
    return grade;
  }

  var mixedRegex = /^(M\d\d?\+?)/;
  matches = rawGrade.match(mixedRegex);
  if (matches) {
    grade.grade = matches[1];
    grade.type = 'Mixed';
    rawGrade = rawGrade.replace(mixedRegex, '').trim();
    if (rawGrade) {
      grade.ukTechGrade = rawGrade;
    }
    return grade;
  }

  var alpineRegex = /^(F\+?|PD[-\+]?|AD[-\+]?|D[-\+]?|TD[-\+]?|ED\d?)/;
  matches = rawGrade.match(alpineRegex);
  if (matches) {
    grade.grade = matches[1];
    grade.type = 'Alpine';
    rawGrade = rawGrade.replace(alpineRegex, '').trim();
    if (rawGrade) {
      grade.ukTechGrade = rawGrade;
    }
    return grade;
  }

  var nordicRegex = /^(n\d[-\+]?)/;
  matches = rawGrade.match(nordicRegex);
  if (matches) {
    grade.grade = matches[1];
    grade.type = 'Nordic';
    rawGrade = rawGrade.replace(nordicRegex, '').trim();
    if (rawGrade) {
      grade.ukTechGrade = rawGrade;
    }
    return grade;
  }

  var vfRegex = /^(VF\d[ABC]{1})/;
  matches = rawGrade.match(vfRegex);
  if (matches) {
    grade.grade = matches[1];
    grade.type = 'Via Ferrata';
    rawGrade = rawGrade.replace(vfRegex, '').trim();
    if (rawGrade) {
      grade.ukTechGrade = rawGrade;
    }
    return grade;
  }

  var uiaaRegex = /^(I|II|III\+?|IV\+?|V[-+]?|VI[-+]?|VII[-+]?|VIII[-+]?|IX[-+]?|X[-+]?|XI[-+]?|XII[-+]?)/;
  matches = rawGrade.match(uiaaRegex);
  if (matches) {
    grade.grade = matches[1];
    grade.type = 'UIAA';
    rawGrade = rawGrade.replace(uiaaRegex, '').trim();
    if (rawGrade) {
      grade.ukTechGrade = rawGrade;
    }
    return grade;
  }

  var aidRegex = /^(A\d)\b/;
  matches = rawGrade.match(aidRegex);
  if (matches) {
    grade.grade = matches[1];
    grade.type = 'Aid';
    rawGrade = rawGrade.replace(aidRegex, '').trim();
    if (rawGrade) {
      grade.ukTechGrade = rawGrade;
    }
    return grade;
  }

  var scrambleRegex = /^(1|2|3S|3)\b/;
  matches = rawGrade.match(scrambleRegex);
  if (matches) {
    grade.grade = matches[1];
    grade.type = 'Scramble';
    return grade;
  }

  var australianRegex = /^(\d\d?)\b/;
  matches = rawGrade.match(australianRegex);
  if (matches) {
    grade.grade = matches[1];
    grade.type = 'Australian';
    return grade;
  }

  var specialRegex = /^(summit)/;
  matches = rawGrade.match(specialRegex);
  if (matches) {
    grade.grade = matches[1];
    grade.type = 'Special';
    return grade;
  }

  return grade;
}

// TODO - refactor and move to a Climb scraper module
function scrapeClimbs ($) {
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
      currentButtress = utils.capitalCase(utils.decodeEntities($row.find('td.normal').text()));
      return;
    }

    var climb = {
      position: position,
      name: utils.decodeEntities($a.text()),
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
    climb.grade = getGradeFromRawGrade(climb.rawGrade);

    climb.totalTicks = parseInt($row.find('td').last().text(), 10) || 0;

    climbs.push(climb);
    position += 1;
  });

  return climbs;
}

var scrapeName = function ($) {
  return utils.decodeEntities($('h1').text().trim());
};

var scrapeGridRef = function ($) {
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

var scrapeMaps = function ($) {
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
            title: utils.decodeEntities($map.attr('title').replace(isbnRegex, ''))
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

var scrapeGeo = function ($) {
  var imgSrc = $('#map img').attr('src');

  var geo = imgSrc ?
    imgSrc.match(/markers=([-\d\.]+),([-\d\.]+)/) : null;

  if (geo) {
    geo.shift();
    geo[0] = parseFloat(geo[0]);
    geo[1] = parseFloat(geo[1]);
  }

  return geo;
};

var scrapeLastUpdated = function ($) {
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

var scrapeArea = function ($) {
  return $('#main a').first().text();
};

var scrapeCountry = function ($, markup) {
  var area = scrapeArea($);
  var matches = markup.match(new RegExp(area + '</a>, ([\\w ]+)'));
  var country = null;
  if (matches) {
    if (matches[1] === 'USA' || matches[1] === 'UAE') {
      country = matches[1];
    } else {
      country = utils.capitalCase(matches[1]);
    }
  }

  return country;
};

var scrapeFeatures = function ($) {
  var features = null;

  $('#main b').each(function (i, el) {
    var $el = $(el);
    if ($el.text() ===  'Crag features') {
      features = getTextForBoldTitle($el);

      return false;
    }
  });

  return features;
};

var scrapeBmcId = function ($) {
  var bmcId = null;

  $('#main b').each(function (i, el) {
    var $el = $(el);
    if ($el.text() === 'Access notes') {
      var $parent = $el.parent();
      var $anchors = $el.siblings('a');
      $anchors.each(function (i, a) {
        var $el = $(a);
        var match = $el.attr('href').match(/http:\/\/www\.thebmc\.co\.uk\/modules\/RAD\/ViewCrag\.aspx\?id=([\d]+)$/);
        if (match) {
          bmcId = parseInt(match[1], 10);
        }
      });
      return false;
    }
  });

  return bmcId;
};

var scrapeAccessNotes = function ($) {
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
      var notes = [utils.cleanupParagraphText($parent.html().replace(/<!--[\s\S]*-->/, ''))];
      var getParagraphContent = false;
      $ps.each(function (i, el) {
        var $el = $(el);
        if ($el.find('b').length) {
          getParagraphContent = false;
        }
        if (getParagraphContent) {
            notes.push(utils.cleanupParagraphText($el.text()));
        }
        if ($el.find('b').text() === 'Guidebooks') {
          getParagraphContent = true;
        }
      });

      accessNotes = [];
      notes.forEach(function (line) {
        line = line.replace(/<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)<\/\1>/i, '').trim();
        if (line && !line.match(/Read more.../)) {
          accessNotes.push(utils.decodeEntities(line));
        }
      });
      accessNotes = accessNotes.join("\n\n");
      return false;
    }
  });

  return accessNotes;
};

var scrapeGuidebooks = function ($) {
  var guidebooks = [];

  $('#main b').each(function (i, el) {
    var $el = $(el);
    if ($el.text() === 'Guidebooks') {
      var $books = $el.parent().find('a');
      $books.each(function (i, el) {
        var $book = $(el);
        var book = {
          title: utils.decodeEntities($book.text()),
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

var pairScraper = function ($, func) {
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

var scrapeTotalClimbs = function ($) {
  return pairScraper($, function (prop, val) {
    if (prop === 'climbs') {
      if (val !== null) {
        val = parseInt(val, 10);
      }

      return val;
    }
  });
};

var scrapeRockType = function ($) {
  return pairScraper($, function (prop, val) {
    if (prop === 'rocktype') {
      return val;
    }
  });
};

var scrapeFaces = function ($) {
  return pairScraper($, function (prop, val) {
    if (prop === 'faces') {
      return val;
    }
  });
};

var scrapeAltitude = function ($) {
  return pairScraper($, function (prop, val) {
    if (prop === 'altitude') {
      if (val !== null) {
        val = (val === 'Tidal') ?
          0 : parseInt(val, 10);
      }

      return val;
    }
  });
};

var scrapeIsTidal = function ($) {
  return pairScraper($, function (prop, val) {
    if (prop === 'altitude') {
      if (val !== null) {
        val = (val === 'Tidal') ?
          true : false;
      }

      return val;
    }
  });
};


module.exports = {
  scrapeName: scrapeName,
  scrapeGridRef: scrapeGridRef,
  scrapeMaps: scrapeMaps,
  scrapeArea: scrapeArea,
  scrapeGeo: scrapeGeo,
  scrapeClimbs: scrapeClimbs,
  scrapeCountry: scrapeCountry,
  scrapeFeatures: scrapeFeatures,
  scrapeGuidebooks: scrapeGuidebooks,
  scrapeAltitude: scrapeAltitude,
  scrapeFaces: scrapeFaces,
  scrapeLastUpdated: scrapeLastUpdated,
  scrapeBmcId: scrapeBmcId,
  scrapeAccessNotes: scrapeAccessNotes,
  scrapeTotalClimbs: scrapeTotalClimbs,
  scrapeRockType: scrapeRockType,
  scrapeIsTidal: scrapeIsTidal
};