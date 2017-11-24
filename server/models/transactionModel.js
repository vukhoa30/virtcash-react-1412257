var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('transactions', new Schema({ 
  walletFromID: Schema.ObjectId, 
  walletToID: Schema.ObjectId,
  amount: Number,
  time: Date
}));