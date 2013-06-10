mongoose = require('mongoose')


exports.createTest = (req, res) ->
  unless req.session.user
    return res.jsonp fail: true

  Model = mongoose.model 'tests'
  ContentModel = mongoose.model 'testcontent'

  model = new Model
    userid: req.session.user.id
    name: req.body.testName
    created: new Date()

  model.save (err) ->
    return res.jsonp fail: true if err
    resultSent = false
    req.body.name.forEach (row, i) ->

      contentModel = new ContentModel
        testid: model._id
        name: req.body.name[i]
        content: req.body.content[i]

      contentModel.save (err) ->
        res.jsonp id: model._id unless resultSent
        resultSent = true
        return


exports.test = (req, res) ->
  rand = (min, max) ->
    min + Math.round(Math.random() * (max - min))

  Model = mongoose.model 'testcontent'
  Model.find({
    testid: req.params.id
  }).exec (err, data) ->
    random = rand(0, data.length - 1)
    res.jsonp data[random]

exports.goal = (req, res) ->
  json = JSON.parse(req.params.json)
  Model = mongoose.model 'goals'
  model = new Model
    testid: req.params.id
    date: new Date()
    testversion: req.params.version
    browser: json.browser
    os: json.os
    mobile: json.mobile
    browserversion: json.version

  model.save (err) ->
    console.log "Goal!"
    res.jsonp []

exports.pageview = (req, res) ->
  Model = mongoose.model 'testpageviews'
  model = new Model
    testversion: req.params.version
    testid: req.params.id
    date: new Date()

  model.save (err) ->
    console.log "Test pageview"
    res.jsonp []

exports.statistics = (req, res) ->
  res.send "Statistics"

exports.statisticsList = (req, res) ->
  return unless req.session.user

  Model = mongoose.model 'tests'
  Model.find({
    userid: req.session.user.id
  }).exec (err, data) ->
    res.jsonp data


exports.statisticsJSON = (req, res) ->
  #Q = require("Q")
  moment = require("moment")
  _ = require("underscore")

  result = {}

  # TODO: implement Q here, this is horrible
  # TODO: Refactor the whole thing, looks horrible


  Model = mongoose.model 'tests'
  Model.findOne({
    _id: req.params.id
  }).exec (err, data) ->
    result.test = data

    Model = mongoose.model 'testcontent'
    Model.find({
      testid: req.params.id
    }).exec (err, data) ->
      rows = {}
      data.forEach (item) ->
        rows[item._id] = item.name
        return
      contentData = rows
      result.content = data

      Model = mongoose.model 'testpageviews'
      Model.find({
        testid: req.params.id
      }).exec (err, data) ->
        rows = []
        count = {}
        data.forEach (item) ->
          count[item.testversion] = 0 unless count[item.testversion]
          count[item.testversion]++

        items = {}
        data.forEach (item) ->
          date = moment(item.date).format("YYYYMMDD")
          items[item.testversion] = {} unless _.isObject items[item.testversion]
          return if items[item.testversion][date]

          items[item.testversion][date] = true
          row = {}
          row.testversion = contentData[item.testversion]
          row.d = moment(date, "YYYYMMDD")
          row.rows = count[item.testversion]

          rows.push row

        result.pageviews = rows

        Model = mongoose.model 'goals'
        Model.find({
          testid: req.params.id
        }).exec (err, data) ->

          rows = []
          count = {}
          data.forEach (item) ->
            count[item.testversion] = 0 unless count[item.testversion]
            count[item.testversion]++

          items = {}
          data.forEach (item) ->
            date = moment(item.date).format("YYYYMMDD")
            items[item.testversion] = {} unless _.isObject items[item.testversion]
            return if items[item.testversion][date]

            items[item.testversion][date] = true
            row = {}
            row.testversion = contentData[item.testversion]
            row.d = moment(date, "YYYYMMDD")
            row.rows = count[item.testversion]

            rows.push row

          result.goals = rows

          res.jsonp result
