var express = require('express');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
var apiRoutes = express.Router();

var jwt = require('jsonwebtoken');
var config = require('./config'); //db

var userCtrl = require('./controllers/userController');
var transactionCtrl = require('./controllers/transactionController');
var walletCtrl = require('./controllers/walletController');

mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setup logger
app.use(morgan('dev'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));
//app.use(express.static(path.join(__dirname, '../build')));

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

apiRoutes.post('/register', function(req, res) {
  userCtrl.register(req, res);
})

apiRoutes.post('/sign-in', function(req, res) {
  userCtrl.signIn(req, res);
})

apiRoutes.post('/get-all-transactions', transactionCtrl.getAllTransactions)

//middleware kiểm tra có user hay ko
app.use(function(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    })
  } else {
    req.user = undefined;
    next();
  }
})

apiRoutes.post('/create-wallet', userCtrl.loginRequired, walletCtrl.createWallet)

apiRoutes.post('/get-self-wallets', userCtrl.loginRequired, walletCtrl.getUserWallets)

apiRoutes.post('/transfer', userCtrl.loginRequired, transactionCtrl.transfer)

apiRoutes.post('/get-self-transactions', userCtrl.loginRequired, transactionCtrl.getSelfTransactions)

apiRoutes.post('/user-info', userCtrl.loginRequired, userCtrl.userInfo)

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

module.exports = app;