var Wallet = require('../models/walletModel');
var User = require('../models/userModel');
var jwt = require('jsonwebtoken');

exports.createWallet = function(req, res) {
  jwt.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
    User.findOne({email: decode.email}, function(err, user) {
      if (err) { return res.status(400).send({ message: 'user not found!' }); }
      var wallet = new Wallet();
      wallet.balance = 1000;
      wallet.userID = user._id;
      wallet.save(function(err, rslt) {
        if (err) { return res.status(400).send({ message: 'creating wallet failed!' }); }
        return res.json(rslt);
      })
    })
  })
}

exports.getUserWallets = function(req, res) {
  jwt.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
    User.findOne({email: decode.email}, function(err, user) {
      if (err) { return res.status(400).send({ message: 'user not found!' }); }
      Wallet.find({userID: user._id}, function(err, wallets) {
        if (err) { return res.status(400).send({ message: 'wallet not found!' }); }
        return res.json(wallets);
      })
    })
  })
}

exports.updateBalance = function(walletID, change, next) {
  Wallet.findOneAndUpdate({_id: walletID}, {$set: {balance: balance + change}}, function(err, rslt) {
    if (err) { return res.status(400).send({ message: 'updating wallet failed!' }); }
    next();
  })
}