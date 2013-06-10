(function() {
  var authenticate, login, mongoose;

  mongoose = require('mongoose');

  exports.register = function(req, res) {
    return res.render("register", {
      session: req.session
    });
  };

  exports.login = function(req, res) {
    var error;
    if (req.params.error) {
      error = 1;
    }
    return res.render("login", {
      error: error,
      session: req.session
    });
  };

  authenticate = function(email, password, callback) {
    var Users, hash;
    hash = require("../utils/password").hash;
    Users = mongoose.model('users');
    return Users.findOne({
      email: email.toLowerCase()
    }).exec(function(err, data) {
      if (!data) {
        return callback(new Error("cannot find user"));
      }
      return hash(password, data.salt, function(err, salf, hash) {
        if (err) {
          return callback(err);
        }
        if (hash === data.password) {
          return callback(null, data);
        }
        return callback(new Error("invalid password"));
      });
    });
  };

  login = function(req, res) {
    return authenticate(req.body.email, req.body.password, function(err, user) {
      if (!user) {
        return res.redirect("/login/error");
      }
      return req.session.regenerate(function() {
        req.session.user = {
          id: user._id,
          email: user.email
        };
        res.redirect("/");
      });
    });
  };

  exports.handleLogin = login;

  exports.logout = function(req, res) {
    req.session.destroy();
    return res.jsonp({
      logout: true
    });
  };

  exports.checkLogin = function(req, res) {
    return res.jsonp({
      login: !!req.session.user
    });
  };

  exports.createAccount = function(req, res) {
    var hash;
    hash = require("../utils/password").hash;
    if (req.session.user) {
      return res.jsonp({
        fail: "logged-in"
      });
    }
    if (!req.body.email || !req.body.password) {
      console.log("No email, password or blogname");
      res.jsonp({
        fail: "empty-fields"
      });
      return;
    }
    if (req.body.password !== req.body.password2) {
      console.log("Passwords don't match");
      res.jsonp({
        fail: "Passwords don't match"
      });
      return;
    }
    return hash(req.body.password, function(err, salt, password) {
      var Users, email;
      if (err) {
        throw err;
      }
      email = req.body.email.toLowerCase().trim();
      Users = mongoose.model('users');
      return Users.findOne({
        email: email
      }).exec(function(err, data) {
        var user;
        if (data) {
          res.jsonp({
            fail: "email-taken"
          });
          return;
        }
        user = new Users({
          email: email,
          password: password,
          salt: salt,
          created: new Date()
        });
        return user.save(function(err) {
          return login(req, res);
        });
      });
    });
  };

}).call(this);
