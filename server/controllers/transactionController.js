var Transaction = require('../models/transactionModel');
var User = require('../models/userModel');
var Wallet = require('../models/walletModel');
var walletCtrl = require('./walletController');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

exports.transfer = function(req, res) {
  User.findOne({'email': req.user.email}, function(err, userFrom) {
    if (err) { return res.status(400).json({ message: 'emailFrom not found!' }); }
    var query = {userID: mongoose.Types.ObjectId(userFrom._id), _id: mongoose.Types.ObjectId(req.body.walletFromID)};
    try {
      mongoose.Types.ObjectId(req.body.walletFromID);
    }
    catch (e) {
      return res.status(400).json({ message: 'walletFrom invalid!' });
    }
    Wallet.findOne({userID: mongoose.Types.ObjectId(userFrom._id), _id: mongoose.Types.ObjectId(req.body.walletFromID)}, function(err, walletFrom) {
      if (err || !walletFrom) { return res.status(400).json({ message: 'walletFrom not found!' }); }
      if (walletFrom.balance < Number(req.body.amount)) { return res.status(400).json({ message: 'not enough money!' }); }
      try {
        mongoose.Types.ObjectId(req.body.walletToID);
      }
      catch (e) {
        return res.status(400).json({ message: 'walletTo invalid!' });
      }
      Wallet.findOne({_id: mongoose.Types.ObjectId(req.body.walletToID)}, function(err, walletTo) {
        if (err || !walletTo) { return res.status(400).json({ message: 'walletTo not found!' }); }
        Wallet.findOneAndUpdate({_id: walletFrom._id}, {$set: {balance: walletFrom.balance - Number(req.body.amount)}}, function(err, rslt) {
          if (err) { return res.status(400).json({ message: 'updating walletFrom failed!' }); }
          Wallet.findOneAndUpdate({_id: walletTo._id}, {$set: {balance: walletTo.balance + Number(req.body.amount)}}, function(err, rslt) {
            if (err) { return res.status(400).json({ message: 'updating walletTo failed!' }); }
            var newTransaction = new Transaction();
            newTransaction.walletFromID = mongoose.Types.ObjectId(req.body.walletFromID);
            newTransaction.walletToID = mongoose.Types.ObjectId(req.body.walletToID);
            newTransaction.amount = Number(req.body.amount);
            newTransaction.time = new Date();
            newTransaction.save(function(err, transaction) {
              if (err) { return res.status(400).json({ message: 'create transaction failed!' }); }
              return res.json(newTransaction);
            })
          })
        })
      })
    })
  }) 
};

exports.getSelfTransactions = function(req, res) {
  Wallet.find({userID: mongoose.Types.ObjectId(req.user._id)}, function(err, wallets) {
    if (err) { return res.status(400).json({ message: 'finding wallet failed!' }); }
    var query = [];
    wallets.forEach(wallet => {
      query.push({walletFromID: wallet._id});
    })
    Transaction.find({$or: query}, function(err, transactions) {
      return res.json(transactions);
    })
  })
}

exports.getAllTransactions = function(req, res) {
  Transaction.find({}, function(err, transactions) {
    if (err) { return res.status(400).json({ message: 'finding failed!' }); }
    return res.json(transactions);
  })
}