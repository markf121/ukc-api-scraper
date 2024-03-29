var Vow = require('vow'),
    pluck = require('mout/array/pluck'),
    camelCase = require('mout/string/camelCase');

module.exports = function (logger, GradeUtils) {
  var difficultyGroups = ['green', 'orange', 'red', 'black'];

  function increaseDifficultyGroupTotalByType (groupPos, typeId, types, inc) {
    var type = camelCase(GradeUtils.climbTypes[typeId]),
        group = difficultyGroups[groupPos];

    if (!types[type]) {
      types[type] = {};
      difficultyGroups.forEach(function (group) {
        types[type][group] = 0;
      });
    }

    types[type][group] += 1;
  }

  function increaseTotalByType (typeId, types, inc) {
    var type = camelCase(GradeUtils.climbTypes[typeId]);
    if (!types[type]) {
      types[type] = 0;
    }

    types[type] += inc;
  }

  function increaseDifficultyGroupTotal (groupPos, totals, inc) {
    var group = difficultyGroups[groupPos];

    difficultyGroups.forEach(function (group) {
      if (!totals[group]) {
        totals[group] = 0;
      }
    });

    totals[group] += inc;
  }

  function CragSaver (data, models) {
    this.data = data;
    this.models = models;
    this.log = logger.child({'class': 'CragSaver'});
  }

  CragSaver.addUniqueItemToArray = function (arr, item) {
    if (arr.indexOf(item) === -1) {
      arr.push(item);
    }

    return arr;
  };

  CragSaver.prototype.save = function () {
    this._promise = Vow.promise();

    this.log.info('Saving Crag:' + this.data._id);

    //delete this.data.climbs;
    this._addReferenceToCountry()
      .then(this._addReferenceToArea, this._fail, null, this)
      .then(this._addReferenceToRockType, this._fail, null, this)
      .then(this._addReferencesToMaps, this._fail, null, this)
      .then(this._addReferencesToGuidebooks, this._fail, null, this)
      .then(this._addReferencesToPhotos, this._fail, null, this)
      .then(this._addReferencesToClimbs, this._fail, null, this)
      .then(this._addReferenceToModerator, this._fail, null, this)
      .then(this._addCrag, this._fail, null, this);

    return this._promise;
  };

  CragSaver.prototype._addReferenceToCountry = function () {
    var self = this;
    var promise = Vow.promise();
    this.log.info('Adding ref to country:' + this.data.country);

    this.models.Country.findOne({name: this.data.country}, '_id', function (err, country) {
      if (err) {
        self.log.error(err);
        promise.reject(err);
        return;
      }
      if (!country) {
        if (self.data.country === 'Unknown') {
          country = {
            _id: null,
            name: 'Unknown'
          };
        } else {
          err = new Error('Can\'t find country: ' + self.data.country);
          self.log.error(err);
          promise.reject(err);
          return;
        }
      }
      self.data.country = country._id;

      promise.fulfill(country);
    });

    return promise;
  };

  CragSaver.prototype._addReferenceToArea = function () {
    var self = this;
    var promise = Vow.promise();

    this.log.info('Adding ref to area:' + this.data.area, ', '+ this.data.country);

    if (this.data.country === null && this.data.area === 'Indoors') {
      this.data.area = null;
      promise.fulfill();
    }

    this.models.Area.findOne({
      name: this.data.area,
      country: this.data.country
    }, '_id', function (err, area) {
      if (err) {
        self.log.error(err);
        promise.reject(err);
        return;
      }
      if (!area) {
        err = new Error('Can\'t find area: ' + self.data.area);
        self.log.error(err);
        promise.reject(err);
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

    if (!this.data.rockType) {
      promise.fulfill();
      return;
    }

    this.log.info('Adding ref to rockType:' + this.data.rockType);

    this.models.RockType.findOne({
      name: this.data.rockType
    }, '_id', function (err, rockType) {
      if (err) {
        self.log.error(err);
        promise.reject(err);
        return;
      }
      if (!rockType) {
        err = new Error('Can\'t find rocktype: ' + self.data.rockType);
        self.log.error(err);
        promise.reject(err);
        return;
      } else {
        self.data.rockType = rockType._id;
      }
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
        data.updated = Date.now();
        promises.push(promise);
        self.log.info('Adding ref to map:' + id);
        self.models.Map.findOneAndUpdate(
          {
            _id: id
          }, data, {
            upsert: true
          }, function (err, map) {
            if (err) {
              self.log.error(err);
              promise.reject(err);
              return;
            }
            map._id = id;
            map.save(function (err, map) {
              self.log.info('Saving map: ' + id);
              if (err) {
                self.log.error(err);
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
        data.updated = Date.now();
        promises.push(promise);

        self.log.info('Adding ref to guidebook:' + id);

        self.models.Guidebook.findOneAndUpdate(
          {
            _id: id
          }, data, {
            upsert: true
          }, function (err, book) {
            if (err) {
              self.log.error(err);
              promise.reject(err);
              return;
            }
            book._id = id;
            book.save(function (err, book) {
              self.log.info('Saving book: ' + id);
              if (err) {
                self.log.error(err);
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

  CragSaver.prototype._addReferencesToPhotos = function () {
    var promises = [];
    var self = this;

    if (this.data.photos) {
      this.data.photos.forEach(function (data, i) {
        var promise = Vow.promise();
        var id = data._id;
        delete data._id;
        data.updated = Date.now();
        promises.push(promise);
        self.log.info('Adding ref to photo:' + id);
        self.models.Photo.findOneAndUpdate(
          {
            _id: id
          }, data, {
            upsert: true
          }, function (err, photo) {
            if (err) {
              self.log.error(err);
              promise.reject(err);
              return;
            }
            photo._id = id;
            photo.save(function (err, photo) {
              self.log.info('Saving photo: ' + id);
              if (err) {
                self.log.error(err);
                promise.reject(err);
                return;
              }
              promise.fulfill(photo);
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
      data.updated = Date.now();
      self.models.Climb.findOneAndUpdate(
        {
          _id: id
        }, data, {
          upsert: true
        }, function (err, climb) {
          self.log.info('Adding ref to climb: ' + id +', ' + data.name);
          if (err) {
            self.log.error(err);
            promise.reject(err);
            return;
          }
          climb._id = id;
          climb.crag = self.data._id;
          climb.save(function (err, climb) {
            self.log.info('Saving climb: ' + id);
            if (err) {
              self.log.error(err);
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
    self.data.totalClimbsByType = {};
    self.data.totalStarsByType = {};
    self.data.difficultyGroupTotals = {};
    self.data.difficultyGroupTotalsByType = {};
    self.data.difficultyGroupStars = {};
    self.data.difficultyGroupStarsByType = {};
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
              self.log.info('Adding ref to grade: ' + data.grade.grade, ', ' + data.grade.type + ', ' + data.grade.climbType);
              if (err) {
                self.log.error(err);
                promise.reject(err);
                return;
              }
              if (!grade) {
                err = new Error('Can\'t find grade: ' + data.grade.grade, ', ' + data.grade.type + ', ' + data.grade.climbType);
                self.log.error(err);
                //promise.reject(err);
                delete data.grade;
              } else {
                data.grade = grade._id;
                if (grade.difficultyGroup !== null) {
                  increaseDifficultyGroupTotal(grade.difficultyGroup, self.data.difficultyGroupTotals, 1);
                  increaseDifficultyGroupTotal(grade.difficultyGroup, self.data.difficultyGroupStars, data.stars);
                  increaseDifficultyGroupTotalByType(
                    grade.difficultyGroup,
                    data.climbType,
                    self.data.difficultyGroupTotalsByType,
                    1
                  );
                  increaseDifficultyGroupTotalByType(
                    grade.difficultyGroup,
                    data.climbType,
                    self.data.difficultyGroupStarsByType,
                    data.stars
                  );
                }
                increaseTotalByType(data.climbType, self.data.totalClimbsByType, 1);
                increaseTotalByType(data.climbType, self.data.totalStarsByType, data.stars);
              }
              saveClimb(i, id, data, promise);
            }
          );
        } else {
          delete data.grade;
          delete data.climbType;
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
      data.updated = Date.now();
      self.models.User.findOneAndUpdate(
        {
          _id: id
        }, data, {
          upsert: true
        }, function (err, moderator) {
          self.log.info('Adding ref to moderator: ' + id);
          if (err) {
            self.log.error(err);
            promise.reject(err);
            return;
          }
          self.data.moderator = id;
          moderator.save(function (err, UserSchema) {
            self.log.info('Saving moderator');
            if (err) {
              self.log.error(err);
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
    if (data.photos) {
      delete data.photos;
    }
    data.updated = Date.now();
    data.updateRequired = false;
    this.models.Crag.findOneAndUpdate(
      {
        _id: id
      }, data, {
        upsert: true
      }, function (err, crag) {
        self.log.info('Saving Crag: ' + id);
        if (err) {
          self.log.error(err);
          self._promise.reject(err);
          return;
        }
        crag._id = id;
        crag.save(function (err) {
          self.log.info('Saving Crag');
          if (err) {
            self.log.error(err);
            self._promise.reject(err);
            return;
          }
          self._promise.fulfill(crag);
        });
      }
    );
  };

  CragSaver.prototype._fail = function (err) {
    this.log.error(err);
    this._promise.reject(err);
  };


  return CragSaver;
};