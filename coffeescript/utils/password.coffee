crypto = require("crypto")

###
Hashes a password with optional `salt`, otherwise
generate a salt for `pass` and invoke `callback(err, salt, hash)`.

@param {String} password to hash
@param {String} optional salt
@param {Function} callback
@api public
###
exports.hash = (password, salt, callback) ->
  iterations = 12500
  len = 512
  sha256 = (password) ->
    crypto.createHash("sha256").update(password).digest "hex"

  password = sha256(crypto.createHash("sha512").update(password).digest("hex"))
  if 3 is arguments.length
    crypto.pbkdf2 password, salt, iterations, len, (err, hash) ->
      return callback(err) if err
      callback null, salt, sha256(hash)

  else
    callback = salt
    crypto.randomBytes len, (err, salt) ->
      return callback(err) if err
      salt = sha256(salt.toString("base64"))
      crypto.pbkdf2 password, salt, iterations, len, (err, hash) ->
        return callback(err) if err
        callback null, salt, sha256(hash)