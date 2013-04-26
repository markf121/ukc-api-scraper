var restify = require('restify'),
    crags = require('./routes/crags');

var server = restify.createServer();
server.get('/crags/:id', crags.findById);

server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url);
});