var xml2js = require('xml2js'),
    injector = require('../lib/injector'),
    async = require('async');

injector.resolve(function (Requester, Scraper, config) {
  var models = require('ukc-models')(config.get('database'));
  var Crag = models.Crag;
  var requester = new Requester();

  requester.request('/logbook/rsscrags.php', function (err, body) {
    body = Scraper.convertToUtf8(body);

    var parser = new xml2js.Parser();
    parser.parseString(body, function (err, result) {
      async.eachSeries(result['rdf:RDF'].item, function (item, done) {
        var matches = item.link[0].match(/(\d+)$/);
        var id;

        if (!matches) {
          done();
          return;
        }

        id = parseInt(matches[1], 10);
        Crag.findOne({_id: id}, function (err, crag) {
          if (crag) {
            if (crag.updated < Date.parse(item['dc:date'])) {
              crag.updateRequired = true;
              crag.save(function (err) {
                console.info(crag.name + ' marked as updateRequired');
                done();
              });
            } else {
              done();
            }
          } else {
            Crag.create({
              _id: id,
              name: item.title[0].replace(/\[.*?\]$/, '').trim(),
              updateRequired: true,
              geo: [0, 0]
            }, function (err, crag) {
              console.info(crag.name + ' added');
              done();
            });
          }
        });
      }, function () {
        //process.exit(0);
      });
    });
  });
});