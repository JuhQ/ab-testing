(function() {
  var mongoose;

  mongoose = require('mongoose');

  exports.createTest = function(req, res) {
    var ContentModel, Model, model;
    if (!req.session.user) {
      return res.jsonp({
        fail: true
      });
    }
    Model = mongoose.model('tests');
    ContentModel = mongoose.model('testcontent');
    model = new Model({
      userid: req.session.user.id,
      name: req.body.testName,
      created: new Date()
    });
    return model.save(function(err) {
      var resultSent;
      if (err) {
        return res.jsonp({
          fail: true
        });
      }
      resultSent = false;
      return req.body.name.forEach(function(row, i) {
        var contentModel;
        contentModel = new ContentModel({
          testid: model._id,
          name: req.body.name[i],
          content: req.body.content[i]
        });
        return contentModel.save(function(err) {
          if (!resultSent) {
            res.jsonp({
              id: model._id
            });
          }
          resultSent = true;
        });
      });
    });
  };

  exports.test = function(req, res) {
    var Model, rand;
    rand = function(min, max) {
      return min + Math.round(Math.random() * (max - min));
    };
    Model = mongoose.model('testcontent');
    return Model.find({
      testid: req.params.id
    }).exec(function(err, data) {
      var random;
      random = rand(0, data.length - 1);
      return res.jsonp(data[random]);
    });
  };

  exports.goal = function(req, res) {
    var Model, json, model;
    json = JSON.parse(req.params.json);
    Model = mongoose.model('goals');
    model = new Model({
      testid: req.params.id,
      date: new Date(),
      testversion: req.params.version,
      browser: json.browser,
      os: json.os,
      mobile: json.mobile,
      browserversion: json.version
    });
    return model.save(function(err) {
      console.log("Goal!");
      return res.jsonp([]);
    });
  };

  exports.pageview = function(req, res) {
    var Model, model;
    Model = mongoose.model('testpageviews');
    model = new Model({
      testversion: req.params.version,
      testid: req.params.id,
      date: new Date()
    });
    return model.save(function(err) {
      console.log("Test pageview");
      return res.jsonp([]);
    });
  };

  exports.statistics = function(req, res) {
    return res.send("Statistics");
  };

  exports.statisticsList = function(req, res) {
    var Model;
    if (!req.session.user) {
      return;
    }
    Model = mongoose.model('tests');
    return Model.find({
      userid: req.session.user.id
    }).exec(function(err, data) {
      return res.jsonp(data);
    });
  };

  exports.statisticsJSON = function(req, res) {
    var Model, moment, result, _;
    moment = require("moment");
    _ = require("underscore");
    result = {};
    Model = mongoose.model('tests');
    return Model.findOne({
      _id: req.params.id
    }).exec(function(err, data) {
      result.test = data;
      Model = mongoose.model('testcontent');
      return Model.find({
        testid: req.params.id
      }).exec(function(err, data) {
        var contentData, rows;
        rows = {};
        data.forEach(function(item) {
          rows[item._id] = item.name;
        });
        contentData = rows;
        result.content = data;
        Model = mongoose.model('testpageviews');
        return Model.find({
          testid: req.params.id
        }).exec(function(err, data) {
          var count, items;
          rows = [];
          count = {};
          data.forEach(function(item) {
            if (!count[item.testversion]) {
              count[item.testversion] = 0;
            }
            return count[item.testversion]++;
          });
          items = {};
          data.forEach(function(item) {
            var date, row;
            date = moment(item.date).format("YYYYMMDD");
            if (!_.isObject(items[item.testversion])) {
              items[item.testversion] = {};
            }
            if (items[item.testversion][date]) {
              return;
            }
            items[item.testversion][date] = true;
            row = {};
            row.testversion = contentData[item.testversion];
            row.d = moment(date, "YYYYMMDD");
            row.rows = count[item.testversion];
            return rows.push(row);
          });
          result.pageviews = rows;
          Model = mongoose.model('goals');
          return Model.find({
            testid: req.params.id
          }).exec(function(err, data) {
            rows = [];
            count = {};
            data.forEach(function(item) {
              if (!count[item.testversion]) {
                count[item.testversion] = 0;
              }
              return count[item.testversion]++;
            });
            items = {};
            data.forEach(function(item) {
              var date, row;
              date = moment(item.date).format("YYYYMMDD");
              if (!_.isObject(items[item.testversion])) {
                items[item.testversion] = {};
              }
              if (items[item.testversion][date]) {
                return;
              }
              items[item.testversion][date] = true;
              row = {};
              row.testversion = contentData[item.testversion];
              row.d = moment(date, "YYYYMMDD");
              row.rows = count[item.testversion];
              return rows.push(row);
            });
            result.goals = rows;
            return res.jsonp(result);
          });
        });
      });
    });
  };

}).call(this);
