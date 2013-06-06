module.exports = function (Requester) {
  var CragRequester = function () {

  };

  CragRequester.prototype = {
    request: function (id, cb) {
      var url = '/logbook/crag.php?id=' + id;

      Requester.prototype.request.apply(this, [url, cb]);
    }
  };

  return CragRequester;
};