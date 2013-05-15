var Scraper = require('./Scraper'),
    util = require('util');

function ClimbScraper (models) {
  this.models = models;
}
util.inherits(ClimbScraper, Scraper);

ClimbScraper.parseRawGrade = function (rawGrade) {
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
};

ClimbScraper.prototype = {
  scrape: function () {

  }
};

module.exports = ClimbScraper;