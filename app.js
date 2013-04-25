var restify = require('restify'),
    cheerio = require('cheerio'),
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
      var $ = cheerio.load(str);

      $('#main > div').first().remove();
      var $area = $('#main a').first();
      cb(null, {
        remote_id: id,
        name: $('h1').text(),
        area: $area.text(),
        country: $area.next().text()
      });
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

function respond (req, res, next) {
  scrapeCrag(req.params.id, function (err, data) {
    //res.setEncoding('utf8');
    res.send(data);
  });
}

var server = restify.createServer();
server.get('/crags/:id', respond);

server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url);
});