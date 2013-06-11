module.exports = function () {

  var GradeUtils = {};

  GradeUtils.climbTypes = [
    'Winter',
    'Trad',
    'Sport',
    'Bouldering',
    'Aid',
    'Alpine',
    'Ice',
    'Mixed',
    'Via Ferrata',
    'Scrambling',
    'Special'
  ];

  GradeUtils.getClimbTypeId = function (type) {
    var id = GradeUtils.climbTypes.indexOf(type);
    if (id >= 0) {
      id = id + 1;
    } else {
      id = null;
    }

    return id;
  };

  GradeUtils.parseRawGrade = function (rawGrade) {
    var grade = {
      ukTechGrade: null,
      stars: 0
    };

    var starsRegex = /(\*{1,3})$/;
    var matches = rawGrade.match(starsRegex);
    if (matches) {
      grade.stars = matches[1].length;
      rawGrade = rawGrade.replace(starsRegex, '').trim();
    }

    var winterRegex = /^(I|I\/II|II|II\/III|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII)\b/;
    matches = rawGrade.match(winterRegex);
    if (matches) {
      grade.grade = matches[1];
      grade.type = 'Scottish';
      grade.climbType = GradeUtils.getClimbTypeId('Winter');
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
      grade.climbType = GradeUtils.getClimbTypeId('Trad');
      rawGrade = rawGrade.replace(ukAdjRegex, '').trim();
      if (rawGrade) {
        grade.ukTechGrade = rawGrade;
      }
      return grade;
    }

    var fontRegex = /^(font [3|4|5]\+?|f[6|7|8|9][A|B|C]\+?)/;
    matches = rawGrade.match(fontRegex);
    if (matches) {
      grade.grade = matches[1];
      grade.type = 'Font';
      grade.climbType = GradeUtils.getClimbTypeId('Bouldering');
      rawGrade = rawGrade.replace(fontRegex, '').trim();
      if (rawGrade) {
        grade.ukTechGrade = rawGrade;
      }
      return grade;
    }

    var vGradesRegex = /^(VB|V[\d]{1,2}[-\+]?)/;
    matches = rawGrade.match(vGradesRegex);
    if (matches) {
      grade.grade = matches[1];
      grade.type = 'V-grades';
      grade.climbType = GradeUtils.getClimbTypeId('Bouldering');
      rawGrade = rawGrade.replace(vGradesRegex, '').trim();
      if (rawGrade) {
        grade.ukTechGrade = rawGrade;
      }
      return grade;
    }

    var frenchRegex = /^(F?[2|3|4|5]\+?|F?[6|7|8|9][a|b|c]\+?)/;
    matches = rawGrade.match(frenchRegex);
    if (matches) {
      grade.grade = matches[1];
      grade.type = 'French';
      rawGrade = rawGrade.replace(frenchRegex, '').trim();
      if (rawGrade) {
        grade.ukTechGrade = rawGrade;
      }
      if (grade.grade.match(/^F/)) {
        grade.climbType = GradeUtils.getClimbTypeId('Trad');
      } else {
        grade.climbType = GradeUtils.getClimbTypeId('Sport');
      }
      return grade;
    }

    var usaRegex = /^(5\.[\d]{1,2}[abcd]?)\b/;
    matches = rawGrade.match(usaRegex);
    if (matches) {
      grade.grade = matches[1];
      grade.type = 'USA';
      rawGrade = rawGrade.replace(usaRegex, '').trim();
      if (rawGrade) {
        grade.ukTechGrade = rawGrade;
        grade.climbType = GradeUtils.getClimbTypeId('Trad');
      } else {
        grade.climbType = GradeUtils.getClimbTypeId('Sport');
      }
      return grade;
    }

    var iceRegex = /^(WI\d\d?\+?)\b/;
    matches = rawGrade.match(iceRegex);
    if (matches) {
      grade.grade = matches[1];
      grade.type = 'Ice';
      grade.climbType = GradeUtils.getClimbTypeId('Ice');
      rawGrade = rawGrade.replace(iceRegex, '').trim();
      if (rawGrade) {
        grade.ukTechGrade = rawGrade;
      }
      return grade;
    }

    var mixedRegex = /^(M\d\d?\+?)\b/;
    matches = rawGrade.match(mixedRegex);
    if (matches) {
      grade.grade = matches[1];
      grade.type = 'Mixed';
      grade.climbType = GradeUtils.getClimbTypeId('Mixed');
      rawGrade = rawGrade.replace(mixedRegex, '').trim();
      if (rawGrade) {
        grade.ukTechGrade = rawGrade;
      }
      return grade;
    }

    var alpineRegex = /^(F\+?|PD[-\+]?|AD[-\+]?|D[-\+]?|TD[-\+]?|ED\d?)\b/;
    matches = rawGrade.match(alpineRegex);
    if (matches) {
      grade.grade = matches[1];
      grade.type = 'Alpine';
      grade.climbType = GradeUtils.getClimbTypeId('Alpine');
      rawGrade = rawGrade.replace(alpineRegex, '').trim();
      if (rawGrade) {
        grade.ukTechGrade = rawGrade;
      }
      return grade;
    }

    var nordicRegex = /^(n\d[-\+]?)\b/;
    matches = rawGrade.match(nordicRegex);
    if (matches) {
      grade.grade = matches[1];
      grade.type = 'Nordic';
      // TODO: work out climb types for this system
      grade.climbType = null;
      rawGrade = rawGrade.replace(nordicRegex, '').trim();
      if (rawGrade) {
        grade.ukTechGrade = rawGrade;
      }
      return grade;
    }

    var vfRegex = /^(VF\d[ABC]{1})\b/;
    matches = rawGrade.match(vfRegex);
    if (matches) {
      grade.grade = matches[1];
      grade.type = 'Via Ferrata';
      grade.climbType = GradeUtils.getClimbTypeId('Via Ferrata');
      rawGrade = rawGrade.replace(vfRegex, '').trim();
      if (rawGrade) {
        grade.ukTechGrade = rawGrade;
      }
      return grade;
    }

    var uiaaRegex = /^(I|II|III\+?|IV\+?|V[-+]?|VI[-+]?|VII[-+]?|VIII[-+]?|IX[-+]?|X[-+]?|XI[-+]?|XII[-+]?)\b/;
    matches = rawGrade.match(uiaaRegex);
    if (matches) {
      grade.grade = matches[1];
      grade.type = 'UIAA';
      // TODO: work out climb types for this system
      grade.climbType = null;
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
      grade.climbType = GradeUtils.getClimbTypeId('Aid');
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
      grade.climbType = GradeUtils.getClimbTypeId('Scrambling');
      return grade;
    }

    var australianRegex = /^(\d\d?)\b/;
    matches = rawGrade.match(australianRegex);
    if (matches) {
      grade.grade = matches[1];
      grade.type = 'Australian';
      // TODO: work out climb types for this system
      grade.climbType = null;
      return grade;
    }

    var specialRegex = /^(summit)/;
    matches = rawGrade.match(specialRegex);
    if (matches) {
      grade.grade = matches[1];
      grade.type = 'Special';
      grade.climbType = GradeUtils.getClimbTypeId('Special');
      return grade;
    }

    return grade;
  };

  return GradeUtils;
};