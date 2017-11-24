var User = require('../models/userModel');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

function comparePassword(client_password, server_password) {
  return bcrypt.compareSync(client_password, server_password)
}

exports.register = function(req, res) {
  User.findOne({ email: req.body.email }, function(err, rslt) {
    if (err) return res.status(401).json({ message: 'Unauthorized user!' });
    if (rslt) return res.status(401).json({ message: 'email existed!' });
    var newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    newUser.wallets = [];
    newUser.save(function(err, user) {
      if (err) {
        return res.status(400).send({message: err});
      } else {
        user.hash_password = undefined;
        return res.json(user);
      }
    });
  })
}

exports.signIn = function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.status(401).json({ message: 'Authentication failed. User not found.' });
    } else if (user) {
      if (!comparePassword(req.body.password, user.hash_password)) {
        res.status(401).json({ message: 'Authentication failed. Wrong password.' });
      } else {
        return res.json({token: jwt.sign({email: user.email, _id: user._id}, 'RESTFULAPIs')});
      }
    }
  });
}

exports.userInfo = function(req, res) {
  jwt.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
    if (err) req.user = undefined;
    return res.json(decode);
  })
}

exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
}