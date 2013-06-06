module.exports = function (Requester) {
  var GuidebookRequester = function () {

  };

  GuidebookRequester.prototype = {
    request: function (id, cb) {
      var url = '/logbook/book.php?id=' + id;

      Requester.prototype.request.apply(this, [url, cb]);
    }
  };

  return GuidebookRequester;
};