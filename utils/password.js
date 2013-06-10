(function() {
  var crypto;

  crypto = require("crypto");

  /*
  Hashes a password with optional `salt`, otherwise
  generate a salt for `pass` and invoke `callback(err, salt, hash)`.
  
  @param {String} password to hash
  @param {String} optional salt
  @param {Function} callback
  @api public
  */


  exports.hash = function(password, salt, callback) {
    var iterations, len, sha256;
    iterations = 12500;
    len = 512;
    sha256 = function(password) {
      return crypto.createHash("sha256").update(password).digest("hex");
    };
    password = sha256(crypto.createHash("sha512").update(password).digest("hex"));
    if (3 === arguments.length) {
      return crypto.pbkdf2(password, salt, iterations, len, function(err, hash) {
        if (err) {
          return callback(err);
        }
        return callback(null, salt, sha256(hash));
      });
    } else {
      callback = salt;
      return crypto.randomBytes(len, function(err, salt) {
        if (err) {
          return callback(err);
        }
        salt = sha256(salt.toString("base64"));
        return crypto.pbkdf2(password, salt, iterations, len, function(err, hash) {
          if (err) {
            return callback(err);
          }
          return callback(null, salt, sha256(hash));
        });
      });
    }
  };

}).call(this);
