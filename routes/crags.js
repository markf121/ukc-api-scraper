var cheerio = require('cheerio'),
    http = require('http');

function scrapeCrag(id, cb) {
  function callback(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      var $ = cheerio.load(str),
          $main = $('#main');

      var imgSrc = $('#map img').attr('src');
      var location = imgSrc.match(/markers=([-\d\.]+),([-\d\.]+)/);

      $('#main > div').first().remove();
      var $area = $('#main a').first();

      var pairs = $('#main > p').first().text().split('–');

      var $b = $main.find('b');
      var features = [];

      $b.each(function (i, el) {
        var $el = $(el);
        var $p;
        var text;
        if ($el.text() === 'Crag features') {
          $p = $el.parent();
          $el.remove();
          while ($p[0] && $p[0].name.toLowerCase() === 'p' && $p.find('b').text() !== 'Weather forecast') {
            text = $p.text().trim();
            if (text) {
              features.push(text);
            }
            $p = $p.next();
          }
        }
      });



      var ret = {
        id: parseInt(id, 10),
        name: $('h1').text().trim(),
        area: $area.text(),
        location: {
          latitude: null,
          longitude: null
        },
        features: features
      };

      if (location) {
        ret.location = {
          latitude: parseFloat(location[1]),
          longitude: parseFloat(location[2])
        };
      }

      pairs.forEach(function (pair, i) {
        var parts = pair.trim().split(' ');
        var prop = parts.shift().toLowerCase().trim();
        var val = parts.join(' ').trim();

        if (val === '?') {
          val = null;
        }

        switch (prop) {
          case 'climbs':
            prop = 'total_climbs';
            if (val !== null) {
              val = parseInt(val, 10);
            }
            break;
          case 'faces':
            if (val !== null) {
              val = val.split(',');
            }
            break;
          case 'altitude':
            if (val !== null) {
              val = parseInt(val, 10);
            }
        }

        ret[prop] = val;
      });

      cb(null, ret);
    });
  }

  http.request({
    host: 'www-cache.reith.bbc.co.uk',
    port: '80',
    path: 'http://www.ukclimbing.com/logbook/crag.php?id=' + id,
    headers: {
      Host: "www.ukclimbing.com"
    }
  }, callback).end();
}

exports.findById = function (req, res, next) {
  scrapeCrag(req.params.id, function (err, data) {
    res.send(data);
  });
};