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
      console.log(str);
      cb(str);
    });
  }

  http.request({
    host: 'www.ukclimbing.com',
    path: '/crag.php?id=' + id
  }, callback).end();
}

function respond (req, res, next) {
  scrapeCrag(req.params.id, function (err, data) {
    res.send(data);
  });
}

var server = restify.createServer();
server.get('/crags/:id', respond);

server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url);
});