var utils = require('./utils');


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

  return arr.join("\n\n");
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

  var ukAdjRegex = /^(M|D|HD|VD|HVD|MS|S|HS|MVS|VS|HVS|E[\d]{1,2}|none|XS)/;
  matches = rawGrade.match(ukAdjRegex);
  if (matches) {
    grade.grade = matches[1];
    rawGrade = rawGrade.replace(ukAdjRegex, '').trim();
    grade.ukTechGrade = rawGrade;
    grade.type = 'Trad';
    return grade;
  }

  var fontRegex = /^(font [3|4|5]\+?|f[6|7|8|9][A|B|C]\+?)/;
  matches = rawGrade.match(fontRegex);
  if (matches) {
    grade.grade = matches[1];
    grade.type = 'Bouldering';
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
    grade.type = 'Bouldering';
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
    }
    return grade;
  }

  var usaRegex = /^(5\.[\d]{1,2}[abcd]?)/;
  matches = rawGrade.match(usaRegex);
  if (matches) {
    grade.grade = matches[1];
    grade.type = 'USA';
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
    grade.type = 'Alpine';
    rawGrade = rawGrade.replace(vfRegex, '').trim();
    if (rawGrade) {
      grade.ukTechGrade = rawGrade;
    }
    return grade;
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
function getClimbs ($) {
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
      currentButtress = utils.capitalCase($row.find('td.normal').text());
      return;
    }

    var climb = {
      position: position,
      name: $a.text(),
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

    climbs.push(climb);
    position += 1;
  });

  return climbs;
}

exports.crag = function (id, cb) {
  function callback (err, $, markup) {
      var $main = $('#main');
      var climbs = getClimbs($);

      var imgSrc = $('#map img').attr('src');
      var location = imgSrc ?
        imgSrc.match(/markers=([-\d\.]+),([-\d\.]+)/) : null;

      var $font = $('#main font[size=1]');
      var gridRef = null;
      var matches;
      if ($font) {
        matches = $font.text().match(/Grid Ref ([\w]{2} [\d]{6})/);
        if (matches) {
          gridRef = matches[1];
        }
      }

      var lastUpdated = null;
      $font.each(function (i, el) {
        matches = $(el).text().match(/These details were last updated on ([\d]{1,2}\/[\w]{3,4}\/[\d]{4})$/);
        if (matches) {
          lastUpdated = new Date(Date.parse(matches[1])).toJSON();
        }
      });

      $('#main > div').first().remove();
      var area = $('#main a').first().text();
      matches = markup.match(new RegExp(area + '</a>, ([\\w ]+)'));
      var country = null;
      if (matches) {
        if (matches[1] === 'USA') {
          country = matches[1];
        } else {
          var arr = matches[1].split(' ');
          country = '';
          arr.forEach(function (w) {
            country += w.substr(0, 1).toUpperCase() + w.substr(1).toLowerCase();
          });
        }
      }

      var pairs = $('#main > p').first().text().split('–');

      var $b = $main.find('b');
      var features = [];
      var accessNotes = [];
      var bmcId = null;
      var guidebooks = [];
      $b.each(function (i, el) {
        var $el = $(el);
        switch ($el.text() ) {
          case 'Crag features':
            features = getTextForBoldTitle($el);

            break;
          case 'Access notes':
            var $parent = $el.parent();
            var $anchors = $el.siblings('a');
            $anchors.each(function (i, a) {
              var $el = $(a);
              var match = $el.attr('href').match(/http:\/\/www\.thebmc\.co\.uk\/modules\/RAD\/ViewCrag\.aspx\?id=([\d]+)$/);
              if (match) {
                bmcId = parseInt(match[1], 10);
              }
            });


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

            notes.forEach(function (line) {
              line = line.replace(/<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)<\/\1>/i, '').trim();
              if (line && !line.match(/Read more.../)) {
                accessNotes.push(line);
              }
            });
            accessNotes = accessNotes.join("\n\n");
            break;
          case 'Guidebooks':
            var $books = $el.parent().find('a');
            $books.each(function (i, el) {
              var $book = $(el);
              var book = {
                title: $book.text(),
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

        }
      });



      var ret = {
        id: parseInt(id, 10),
        name: $('h1').text().trim(),
        area: area,
        country: country,
        latitude: null,
        longitude: null,
        altitude: null,
        isTidal: false,
        features: features,
        accessNotes: accessNotes,
        gridRef: gridRef,
        bmcId: bmcId,
        lastUpdated: lastUpdated,
        guidebooks: guidebooks,
        climbs: climbs
      };

      if (location) {
        ret.latitude = parseFloat(location[1]);
        ret.longitude = parseFloat(location[2]);
      }

      pairs.forEach(function (pair, i) {
        var parts = pair.trim().split(' ');
        var prop = parts.shift().toLowerCase().trim();
        var val = parts.join(' ').trim();

        if (val === '?' || val === 'UNKNOWN') {
          val = null;
        }

        switch (prop) {
          case 'climbs':
            prop = 'totalClimbs';
            if (val !== null) {
              val = parseInt(val, 10);
            }
            break;
          case 'altitude':
            if (val !== null) {
              if (val === 'Tidal') {
                val = 0;
                ret.isTidal = true;
              } else {
                val = parseInt(val, 10);
              }
            }
        }

        ret[prop] = val;
      });

      cb(null, ret);
  }

  utils.scrapePage('/logbook/crag.php?id=' + id, callback);
};