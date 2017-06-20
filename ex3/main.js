var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);

var userList = [];
var itemList = [];

// should add user/password to the user-list
app.post('/register/:username/:password', function(req, res, next){
  // TODO: Implement
  null;
});

// should log in
app.post('/login/:username/:password', function(req, res, next){
    // TODO: Implement
    null;
});

// Should add the json item to the items-list
app.post('/item/', function(req, res, next){
    // TODO: Implement
    null;
});

// returns all the items as an array
app.get('/items', function(req, res, next){
    // TODO: Implement
    null;
});

// returns the item with the right id or 404 if no such an item
app.get('/item/:id', function(req, res, next){
    // TODO: Implement
    null;
});

// delete the item with the right id or 404 if no such an item
app.delete('/item/:id', function(req, res, next){
    // TODO: Implement
    null;
});

// (item from type json in the HTTP body) overwrite the properties values of the item with the same id or 404 if no such an item
app.use('/item/', function(req, res, next){
    // TODO: Implement
    null;
});

// catch 404 and forward to error handler
app.put(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
