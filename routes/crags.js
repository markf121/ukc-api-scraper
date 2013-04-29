var cheerio = require('cheerio'),
    request = require('request'),
    iconv = require('iconv');

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

  return arr;
}

function scrapeCrag (id, cb) {
  function callback (err, response, body) {

    if (err) {
      cb(err);
      return;
    } else if (response.statusCode >= 400) {
      cb(new Error('Not found'));
      return;
    }

    var ic = new iconv.Iconv('iso-8859-1', 'utf-8');
    var buf = ic.convert(body);
    var utf8String = buf.toString('utf-8');

      var $ = cheerio.load(utf8String),
          $main = $('#main');

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

      $('#main > div').first().remove();
      var area = $('#main a').first().text();
      matches = utf8String.match(new RegExp(area + '</a>, ([\\w ]+)'));
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
      var access_notes = [];

      $b.each(function (i, el) {
        var $el = $(el);
        switch ($el.text() ) {
          case 'Crag features':
            features = getTextForBoldTitle($el);

            break;
          case 'Access notes':
            var $parent = $el.parent();
            while ($el.prev().length) {
              var $prev = $el;
              $el = $el.prev();
              $prev.remove();
            }
            access_notes = $parent.text().replace(/<!--[\s\S]*-->/, '').trim();
            break;
        }
      });



      var ret = {
        id: parseInt(id, 10),
        name: $('h1').text().trim(),
        area: area,
        country: country,
        location: {
          latitude: null,
          longitude: null
        },
        features: features,
        access_notes: access_notes,
        grid_ref: gridRef
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

        if (val === '?' || val === 'UNKNOWN') {
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
            if (val !== null && val !== 'Tidal') {
              val = parseInt(val, 10);
            }
        }

        ret[prop] = val;
      });

      cb(null, ret);
  }

  request.get({
    url: 'http://www.ukclimbing.com/logbook/crag.php?id=' + id,
    //proxy: 'http://www-cache.reith.bbc.co.uk',
    encoding: null
  }, callback);
}

exports.findById = function (req, res, next) {
  scrapeCrag(req.params.id, function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
};