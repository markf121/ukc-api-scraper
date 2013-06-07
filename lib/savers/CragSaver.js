var Vow = require('vow');

module.exports = function () {

  function CragSaver (data, models) {
    this.data = data;
    this.models = models;
  }

  CragSaver.addUniqueItemToArray = function (arr, item) {
    if (arr.indexOf(item) === -1) {
      arr.push(item);
    }

    return arr;
  };

  CragSaver.prototype.save = function () {
    this._promise = Vow.promise();

    this._addReferenceToCountry()
      .then(this._addReferenceToArea, this._fail, null, this)
      .then(this._addReferenceToRockType, this._fail, null, this)
      .then(this._addReferencesToMaps, this._fail, null, this)
      .then(this._addReferencesToGuidebooks, this._fail, null, this)
      .then(this._addReferencesToClimbs, this._fail, null, this)
      .then(this._addReferenceToModerator, this._fail, null, this)
      .then(this._addCrag, this._fail, null, this);

    return this._promise;
  };

  CragSaver.prototype._addReferenceToCountry = function () {
    var self = this;
    var promise = Vow.promise();

    this.models.Country.findOne({name: this.data.country}, '_id', function (err, country) {
      if (err) {
        promise.reject(err);
        return;
      }
      if (!country) {
        promise.reject(new Error('Can\'t find country'));
        return;
      }
      self.data.country = country._id;

      promise.fulfill(country);
    });

    return promise;
  };

  CragSaver.prototype._addReferenceToArea = function () {
    var self = this;
    var promise = Vow.promise();

    this.models.Area.findOne({
      name: this.data.area,
      country: this.data.country
    }, '_id', function (err, area) {
      if (err) {
        promise.reject(err);
        return;
      }
      if (!area) {
        promise.reject(new Error('Can\'t find area'));
        return;
      }
      self.data.area = area._id;
      promise.fulfill(area);
    });

    return promise;
  };

  CragSaver.prototype._addReferenceToRockType = function () {
    var self = this;
    var promise = Vow.promise();

    this.models.RockType.findOne({
      name: this.data.rockType
    }, '_id', function (err, rockType) {
      if (err) {
        promise.reject(err);
        return;
      }
      if (!rockType) {
        promise.reject(new Error('Can\'t find rocktype'));
        return;
      }
      self.data.rockType = rockType._id;
      promise.fulfill(rockType);
    });

    return promise;
  };

  CragSaver.prototype._addReferencesToMaps = function () {
    var promises = [];
    var self = this;

    if (this.data.maps) {
      this.data.maps.forEach(function (data, i) {
        var promise = Vow.promise();
        var id = data._id;
        delete data._id;
        promises.push(promise);
        self.models.Map.findOneAndUpdate(
          {
            _id: id
          }, data, {
            upsert: true
          }, function (err, map) {
            if (err) {
              promise.reject(err);
              return;
            }
            map._id = id;
            map.save(function (err, map) {
              if (err) {
                promise.reject(err);
                return;
              }

              self.data.maps[i] = id;
              promise.fulfill(map);
            });
          }
        );
      });
    }

    return Vow.all(promises);
  };

  CragSaver.prototype._addReferencesToGuidebooks = function () {
    var promises = [];
    var self = this;

    if (this.data.guidebooks) {
      this.data.guidebooks.forEach(function (data, i) {
        var promise = Vow.promise();
        var id = data._id;
        delete data._id;
        promises.push(promise);
        self.models.Guidebook.findOneAndUpdate(
          {
            _id: id
          }, data, {
            upsert: true
          }, function (err, book) {
            if (err) {
              promise.reject(err);
              return;
            }
            book._id = id;
            book.save(function (err, book) {
              if (err) {
                promise.reject(err);
                return;
              }

              self.data.guidebooks[i] = id;
              promise.fulfill(book);
            });
          }
        );
      });
    }

    return Vow.all(promises);
  };

  CragSaver.prototype._addReferencesToClimbs = function () {
    var promises = [];
    var self = this;

    function saveClimb(i, id, data, promise) {
      self.models.Climb.findOneAndUpdate(
        {
          _id: id
        }, data, {
          upsert: true
        }, function (err, climb) {
          if (err) {
            promise.reject(err);
            return;
          }
          climb._id = id;
          climb.crag = self.data._id;
          climb.save(function (err, climb) {
            if (err) {
              promise.reject(err);
              return;
            }

            self.data.climbs[i] = id;
            promise.fulfill(climb);
          });
        }
      );
    }

    self.data.climbTypes = [];
    if (this.data.climbs) {
      this.data.climbs.forEach(function (data, i) {
        if (data.climbType) {
          CragSaver.addUniqueItemToArray(self.data.climbTypes, data.climbType);
        }
        var promise = Vow.promise();
        var id = data._id;
        delete data._id;
        promises.push(promise);

        if (data.grade && data.climbType) {
          self.models.Grade.findOne(
            {
              grade: data.grade.grade,
              type: data.grade.type,
              climbType: data.climbType
            }, function (err, grade) {
              if (err) {
                promise.reject(err);
                return;
              }
              if (!grade) {
                promise.reject(new Error('Can\'t find grade'));
                return;
              }
              data.grade = grade._id;
              saveClimb(i, id, data, promise);
            }
          );
        } else {
          saveClimb(i, id, data, promise);
        }
      });
    }
    self.data.climbTypes.sort();

    return Vow.all(promises);
  };

  CragSaver.prototype._addReferenceToModerator = function () {
    var self = this;
    var promise = Vow.promise();
    var data = this.data.moderator;

    if (!this.data.moderator) {
      promise.fulfill();
    } else {
      var id = data.id;
      delete data.id;
      self.models.User.findOneAndUpdate(
        {
          _id: id
        }, data, {
          upsert: true
        }, function (err, moderator) {
          if (err) {
            promise.reject(err);
            return;
          }
          self.data.moderator = id;
          moderator.save(function (err, UserSchema) {
            if (err) {
              promise.reject(err);
              return;
            }

            promise.fulfill(moderator);
          });
        }
      );
    }

    return promise;
  };

  CragSaver.prototype._addCrag = function () {
    var self = this;
    var data = this.data;
    var id = data._id;
    delete data._id;
    if (data.climbs) {
      delete data.climbs;
    }
    this.models.Crag.findOneAndUpdate(
      {
        _id: id
      }, data, {
        upsert: true
      }, function (err, crag) {
        if (err) {
          self._promise.reject(err);
          return;
        }
        crag._id = id;
        crag.save();
        self._promise.fulfill(crag);
      }
    );
  };

  CragSaver.prototype._fail = function (err) {
    this._promise.reject(err);
  };


  return CragSaver;
};