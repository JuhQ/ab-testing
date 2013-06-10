mongoose = require('mongoose')

# Prints registration form
exports.register = (req, res) ->
  res.render "register",
    session: req.session

exports.login = (req, res) ->
  error = 1 if req.params.error
  res.render "login",
    error: error
    session: req.session

# Authenticate using our plain-object database of doom!
authenticate = (email, password, callback) ->
  hash = require("../utils/password").hash

  Users = mongoose.model 'users'
  Users.findOne({
    email: email.toLowerCase()
  }).exec (err, data) ->
    return callback(new Error("cannot find user")) unless data
      
    # apply the same algorithm to the POSTed password, applying
    # the hash against the password / salt, if there is a match we
    # found the user
    hash password, data.salt, (err, salf, hash) ->
      return callback(err) if err
      return callback(null, data) if hash is data.password
      callback new Error("invalid password")

login = (req, res) ->
  authenticate req.body.email, req.body.password, (err, user) ->
    return res.redirect "/login/error" unless user

    # Regenerate session when signing in to prevent fixation
    req.session.regenerate ->
      req.session.user =
        id: user._id
        email: user.email
      res.redirect "/"
      return

exports.handleLogin = login
exports.logout = (req, res) ->
  req.session.destroy()
  res.jsonp logout: true

exports.checkLogin = (req, res) ->
  res.jsonp login: !!req.session.user

# Saves user to the database
exports.createAccount = (req, res) ->
  hash = require("../utils/password").hash

  if req.session.user
    return res.jsonp fail: "logged-in"

  if not req.body.email or not req.body.password
    console.log "No email, password or blogname"
    res.jsonp fail: "empty-fields"
    return

  if req.body.password isnt req.body.password2
    console.log "Passwords don't match"
    res.jsonp fail: "Passwords don't match"
    return

  hash req.body.password, (err, salt, password) ->
    throw err if err

    email = req.body.email.toLowerCase().trim()

    Users = mongoose.model 'users'
    Users.findOne({
      email: email
    }).exec (err, data) ->
      if data
        res.jsonp fail: "email-taken"
        return

      user = new Users
        email: email
        password: password
        salt: salt
        created: new Date()

      user.save (err) ->
        login req, res