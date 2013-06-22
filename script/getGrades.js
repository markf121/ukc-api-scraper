var request = require('request'),
    models = require('ukc-models')({
      host: "mongodb://localhost/test"
    }),
    Grade = models.Grade,
    GradeType = models.GradeType,
    ClimbType = models.ClimbType,
    Vow = require('vow'),
    modelsLib = require('ukc-models/lib');

var grades = [];
grades[1] = ["220|Scottish - I","221|Scottish - I/II","222|Scottish - II","223|Scottish - II/III","224|Scottish - III","225|Scottish - IV","226|Scottish - V","227|Scottish - VI","228|Scottish - VII","229|Scottish - VIII","230|Scottish - IX","231|Scottish - X","232|Scottish - XI"];
grades[2] = ["12|British - M","13|British - D","15|British - HD","16|British - VD","17|British - HVD","18|British - MS","19|British - S","20|British - HS","21|British - MVS","22|British - VS","23|British - HVS","24|British - E1","25|British - E2","57|British - E3","58|British - E4","59|British - E5","60|British - E6","61|British - E7","62|British - E8","63|British - E9","64|British - E10","65|British - E11","381|British - E12","66|British - none","67|British - XS","274|USA - 5.1","275|USA - 5.2","276|USA - 5.3","277|USA - 5.4","278|USA - 5.5","279|USA - 5.6","280|USA - 5.7","281|USA - 5.8","282|USA - 5.9","283|USA - 5.10a","284|USA - 5.10b","285|USA - 5.10c","286|USA - 5.10d","287|USA - 5.11a","288|USA - 5.11b","289|USA - 5.11c","290|USA - 5.11d","291|USA - 5.12a","292|USA - 5.12b","293|USA - 5.12c","294|USA - 5.12d","295|USA - 5.13a","296|USA - 5.13b","297|USA - 5.13c","298|USA - 5.13d","299|USA - 5.14a","300|USA - 5.14b","301|USA - 5.14c","302|USA - 5.14d","303|USA - 5.15a","404|French - F2","405|French - F2+","406|French - F3","407|French - F3+","408|French - F4","409|French - F4+","410|French - F5","411|French - F5+","412|French - F6a","413|French - F6a+","414|French - F6b","415|French - F6b+","416|French - F6c","417|French - F6c+","418|French - F7a","419|French - F7a+","420|French - F7b","421|French - F7b+","422|French - F7c","423|French - F7c+","424|French - F8a","425|French - F8a+","426|French - F8b","427|French - F8b+","428|French - F8c","429|French - F8c+","430|French - F9a","431|French - F9a+","432|French - F9b","434|Australian - 4","435|Australian - 5","436|Australian - 6","437|Australian - 7","438|Australian - 8","439|Australian - 9","440|Australian - 10","441|Australian - 11","442|Australian - 12","443|Australian - 13","444|Australian - 14","445|Australian - 15","446|Australian - 16","447|Australian - 17","448|Australian - 18","449|Australian - 19","450|Australian - 20","451|Australian - 21","452|Australian - 22","453|Australian - 23","454|Australian - 24","455|Australian - 25","456|Australian - 26","457|Australian - 27","458|Australian - 28","459|Australian - 29","460|Australian - 30","461|Australian - 31","462|Australian - 32","463|Australian - 33","464|Australian - 34","465|Australian - 35","466|Australian - 36","467|Australian - 37","469|Nordic - n2","470|Nordic - n3","571|Nordic - n3+","471|Nordic - n4","472|Nordic - n4+","473|Nordic - n5-","474|Nordic - n5","475|Nordic - n5+","476|Nordic - n6-","477|Nordic - n6","478|Nordic - n6+","479|Nordic - n7-","480|Nordic - n7","481|Nordic - n7+","482|Nordic - n8-","483|Nordic - n8","484|Nordic - n8+","485|Nordic - n9-","486|Nordic - n9","487|Nordic - n9+","488|UIAA - I","489|UIAA - II","490|UIAA - III","493|UIAA - III+","494|UIAA - IV","495|UIAA - IV+","496|UIAA - V-","497|UIAA - V","498|UIAA - V+","499|UIAA - VI-","500|UIAA - VI","501|UIAA - VI+","502|UIAA - VII-","503|UIAA - VII","504|UIAA - VII+","505|UIAA - VIII-","506|UIAA - VIII","507|UIAA - VIII+","508|UIAA - IX-","509|UIAA - IX","510|UIAA - IX+","511|UIAA - X-","512|UIAA - X","513|UIAA - X+","514|UIAA - XI-","515|UIAA - XI","516|UIAA - XI+","517|UIAA - XII-","518|UIAA - XII","519|UIAA - XII+"];
grades[3] = ["26|French - 2","27|French - 2+","28|French - 3","29|French - 3+","30|French - 4","31|French - 4+","32|French - 5","33|French - 5+","34|French - 6a","35|French - 6a+","36|French - 6b","37|French - 6b+","38|French - 6c","39|French - 6c+","40|French - 7a","41|French - 7a+","42|French - 7b","43|French - 7b+","44|French - 7c","45|French - 7c+","46|French - 8a","47|French - 8a+","48|French - 8b","49|French - 8b+","50|French - 8c","51|French - 8c+","52|French - 9a","53|French - 9a+","54|French - 9b","577|French - 9b+","568|French - Project","244|USA - 5.1","245|USA - 5.2","246|USA - 5.3","247|USA - 5.4","248|USA - 5.5","249|USA - 5.6","250|USA - 5.7","251|USA - 5.8","252|USA - 5.9","253|USA - 5.10a","254|USA - 5.10b","255|USA - 5.10c","256|USA - 5.10d","257|USA - 5.11a","258|USA - 5.11b","259|USA - 5.11c","260|USA - 5.11d","261|USA - 5.12a","262|USA - 5.12b","263|USA - 5.12c","264|USA - 5.12d","265|USA - 5.13a","266|USA - 5.13b","267|USA - 5.13c","268|USA - 5.13d","269|USA - 5.14a","270|USA - 5.14b","271|USA - 5.14c","272|USA - 5.14d","273|USA - 5.15a","304|Australian - 4","305|Australian - 5","306|Australian - 6","307|Australian - 7","308|Australian - 8","309|Australian - 9","310|Australian - 10","311|Australian - 11","312|Australian - 12","313|Australian - 13","314|Australian - 14","315|Australian - 15","316|Australian - 16","317|Australian - 17","318|Australian - 18","319|Australian - 19","320|Australian - 20","321|Australian - 21","337|Australian - 22","322|Australian - 23","323|Australian - 24","324|Australian - 25","325|Australian - 26","326|Australian - 27","327|Australian - 28","328|Australian - 29","329|Australian - 30","330|Australian - 31","331|Australian - 32","332|Australian - 33","333|Australian - 34","334|Australian - 35","335|Australian - 36","336|Australian - 37","383|Nordic - n2","384|Nordic - n3","570|Nordic - n3+","385|Nordic - n4","386|Nordic - n4+","387|Nordic - n5-","388|Nordic - n5","389|Nordic - n5+","390|Nordic - n6-","391|Nordic - n6","392|Nordic - n6+","393|Nordic - n7-","394|Nordic - n7","395|Nordic - n7+","396|Nordic - n8-","397|Nordic - n8","398|Nordic - n8+","399|Nordic - n9-","400|Nordic - n9","401|Nordic - n9+","520|UIAA - I","521|UIAA - II","522|UIAA - III","523|UIAA - III+","524|UIAA - IV","525|UIAA - IV+","526|UIAA - V-","527|UIAA - V","528|UIAA - V+","529|UIAA - VI-","530|UIAA - VI","531|UIAA - VI+","532|UIAA - VII-","533|UIAA - VII","534|UIAA - VII+","535|UIAA - VIII-","536|UIAA - VIII","537|UIAA - VIII+","538|UIAA - IX-","539|UIAA - IX","540|UIAA - IX+","541|UIAA - X-","542|UIAA - X","543|UIAA - X+","544|UIAA - XI-","545|UIAA - XI","546|UIAA - XI+","547|UIAA - XII-","548|UIAA - XII","549|UIAA - XII+"];
grades[4] = ["127|V-grades - VB","128|V-grades - V0-","129|V-grades - V0","130|V-grades - V0+","131|V-grades - V1","132|V-grades - V2","133|V-grades - V3","134|V-grades - V4","135|V-grades - V5","136|V-grades - V6","137|V-grades - V7","138|V-grades - V8","139|V-grades - V8+","140|V-grades - V9","141|V-grades - V10","142|V-grades - V11","143|V-grades - V12","144|V-grades - V13","145|V-grades - V14","146|V-grades - V15","147|Font - font 3","148|Font - font 3+","573|Font - font 2","574|Font - font 2+","149|Font - font 4","175|Font - font 4+","176|Font - font 5","177|Font - font 5+","178|Font - f6A","179|Font - f6A+","180|Font - f6B","181|Font - f6B+","182|Font - f6C","183|Font - f6C+","184|Font - f7A","185|Font - f7A+","186|Font - f7B","187|Font - f7B+","188|Font - f7C","189|Font - f7C+","190|Font - f8A","191|Font - f8A+","192|Font - f8B","193|Font - f8B+","194|Font - f8C"];
grades[5] = ["73|A1","74|A2","75|A3","77|A4","78|A5"];
grades[6] = ["362|F","363|F+","364|PD-","365|PD","366|PD+","367|AD-","368|AD","369|AD+","370|D-","371|D","372|D+","373|TD-","374|TD","375|TD+","376|ED1","377|ED2","378|ED3","379|ED4","380|ED5"];
grades[7] = ["85|WI1","86|WI2","87|WI2+","88|WI3","89|WI3+","90|WI4","91|WI4+","92|WI5","93|WI5+","94|WI6","95|WI6+","96|WI7","569|WI8"];
grades[8] = ["196|M1","554|M1+","197|M2","555|M2+","198|M3","556|M3+","199|M4","557|M4+","200|M5","558|M5+","201|M6","559|M6+","202|M7","560|M7+","203|M8","561|M8+","204|M9","562|M9+","205|M10","563|M10+","206|M11","564|M11+","207|M12","565|M12+","550|M13","566|M13+","551|M14","567|M14+","552|M15"];
grades[9] = ["338|VF1A","339|VF1B","340|VF1C","341|VF2A","342|VF2B","343|VF2C","344|VF3A","345|VF3B","346|VF3C","347|VF4A","348|VF4B","349|VF4C","350|VF5A","351|VF5B","352|VF5C"];
grades[10] = ["354|1","355|2","356|3","357|3S"];
grades[11] = ["572|  - summit"];

var difficultySplits = {
  French: ['F5', 'F6b', 'F7a+'],
  French_Sport: ['5', '6b', '7a+'],
  British: ['HS', 'E1', 'E4'],
  UIAA: ['VI-', 'VII', 'VIII+'],
  USA: ['5.9', '5.10d', '5.12a'],
  Nordic: ['5-', '6', '7'],
  Australian: ['16', '20', '24'],
  'V-grades': ['V0+', 'V3', 'V7'],
  Font: ['font 5', 'f6A+', 'f7A+'],
  Scrambling: ['2', '3', '3S'],
  Aid: ['2A', '3A', '4A'],
  Scottish: ['III', 'V', 'VII']
};

var climbTypes = [
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

var addClimbTypes = function (climbTypes) {
  var promises = [];

  climbTypes.forEach(function (type, i) {
    var promise = Vow.promise();
    promises.push(promise);

    modelsLib.updateOrCreate(ClimbType, {
        _id: i + 1,
        type: type,
        updated: Date.now()
      }, function (err, climbType) {
        if (err) {
          promise.reject(err);
        } else {
          promise.fulfill(climbType);
        }
      });
  });

  return Vow.promise(promises);
};

var addGradeType = function (type) {
  modelsLib.updateOrCreate(GradeType, {
      _id: type,
      type: type,
      updated: Date.now()
    }, function (err) {}
  );
};

var addGrades = function (climbTypes, climbTypeData) {
  climbTypeData.forEach(function (grades, i) {
    var currentDifficultyIndex,
        currentGradeType;
    grades.forEach(function (grade, j) {
      var pair = grade.split('|'),
          id = parseInt(pair[0], 10),
          text = pair[1],
          gradePair = text.split(' - '),
          climbType = climbTypes[i - 1],
          gradeType,
          gradeValue;
      console.info(grade);

      if (gradePair.length > 1) {
        gradeValue = gradePair[1];
        if (gradePair[0].trim() !== '') {
          gradeType = gradePair[0];
        }
      } else {
        gradeValue = gradePair[0];
      }
      gradeType = gradeType || climbType;

      if (currentGradeType !== gradeType) {
        currentDifficultyIndex = 0;
        currentGradeType = gradeType;
      }

      var difficultyIndex,
          color;

      if (difficultySplits[gradeType]) {
        difficultyIndex = difficultySplits[gradeType].indexOf(gradeValue);

        if (difficultyIndex > -1) {
          currentDifficultyIndex = difficultyIndex + 1;
        } else if (difficultySplits[gradeType + '_' + climbType]) {
          difficultyIndex = difficultySplits[gradeType + '_' + climbType].indexOf(gradeValue);
          if (difficultyIndex > -1) {
            currentDifficultyIndex = difficultyIndex + 1;
          }
        }
      }
      console.info(currentDifficultyIndex);

      addGradeType(gradeType);

      modelsLib.updateOrCreate(Grade, {
          _id: id,
          grade: gradeValue,
          climbType: i,
          type: gradeType,
          sortPosition: (i * 1000) + j,
          difficultyGroup: currentDifficultyIndex,
          updated: Date.now()
        }, function (err, gradeType) {
          //console.info(gradeType);
        }
      );

      //console.info(gradeType + '=' + gradeValue);
    });
  });
};

addClimbTypes(climbTypes).then(function () {
  addGrades(climbTypes, grades);
});