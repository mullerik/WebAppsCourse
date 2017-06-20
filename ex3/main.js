var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);

var uidCounter = 0;
var userList = {};
var itemList = {};

// should add user/password to the user-list
app.post('/register/:username/:password', function(req, res, next){
    var username = req.params.username;
    var password = req.params.password;
    if (username in userList){
        console.log("Error: User already exists");
        res.sendStatus(500);
    } else {
        uid = uidCounter;
        uidCounter++;
        userList[username] = {"uid": uid, "password": password};
        console.log("Success: Created user " + username + " uid: " + uid);
        res.sendStatus(200);
    }

});

// should log in
app.post('/login/:username/:password', function(req, res, next){
    var username = req.params.username;
    var password = req.params.password;
    if (username in userList){
        console.log("Success: Logged in with user " + username);
        if (userList[username]['password'] === password) {
            res.cookie('uid', userList[username]['uid'], {maxAge: 3600000}); // Expires after 60 minutes
            res.sendStatus(200);
        } else {
            console.log("Error: password doesn't match user " + username);
            res.sendStatus(403);
        }
    } else {
        console.log("Error: user " + username + " doesn't exist");
        res.sendStatus(500);
    }
});

// Validate only logged in users access the next routes
app.use('/',function(req,res,next){
    console.log(req.cookies.uid);
    next()
    // if(logedInUsersTag[req.cookies.uid]) {
    //     next();
    // }else{
    //     res.json("You are unauthorized. Please login.");
    // }
});

// Should add the json item to the items-list
app.post('/item/', function(req, res, next){
    console.log("Adding item to the item list");
    itemList[parseInt(req.body.id)] = req.body.data;
    console.log(itemList);
    res.sendStatus(200);
});

// returns all the items as an array
app.get('/items', function(req, res, next){
    res.json(Object.keys(itemList).map(function(itemID){
        return {"id": itemID, "data": itemList[itemID]};
    }));
});

// returns the item with the right id or 404 if no such an item
app.get('/item/:id', function(req, res, next){
    var itemID = parseInt(req.param.id);
    if (itemID in itemList){
        res.json({"id": itemID, "data": itemList[itemID]})
    } else {
        res.sendStatus(404);
    }
});

// delete the item with the right id or 404 if no such an item
app.delete('/item/:id', function(req, res, next){
    var itemID = parseInt(req.param.id);
    if (itemID in itemList){
        delete itemList[itemID]
    } else {
        res.sendStatus(404);
    }
});

// (item from type json in the HTTP body) overwrite the properties values of the item with the same id or 404 if no such an item
app.put('/item/', function(req, res, next){
    var itemID = parseInt(req.body.id);
    var newItemData = req.body.data;
    if (itemID in itemList){
        itemList[itemID] = newItemData;
    } else {
        res.sendStatus(404);
    }
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
