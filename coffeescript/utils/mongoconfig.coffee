mongoose = require('mongoose')
module.exports = () ->

  goalSchema = mongoose.Schema {
    testid: "ObjectId"
    date: "Date"
    testversion: "ObjectId"
    browser: "String"
    os: "String"
    mobile: "Boolean"
    browserversion: "Number"
  }

  testContentSchema = mongoose.Schema {
    testid: "ObjectId"
    name: "String"
    content: "String"
  }
  testPageviewSchema = mongoose.Schema {
    testversion: "ObjectId"
    testid: "ObjectId"
    date: "Date"
  }
  testsSchema = mongoose.Schema {
    userid: "ObjectId"
    name: "String"
    created: "Date"
  }
  userSchema = mongoose.Schema {
    email: "String"
    password: "String"
    salt: "String"
    created: "Date"
  }

  mongoose.model 'goals', goalSchema
  mongoose.model 'testcontent', testContentSchema
  mongoose.model 'testpageviews', testPageviewSchema
  mongoose.model 'tests', testsSchema
  mongoose.model 'users', userSchema

  mongoose.connect 'localhost', 'abtesting'