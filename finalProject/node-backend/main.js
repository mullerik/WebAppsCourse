var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

const COOKIE_LIFETIME = 3600000;

function renewCookie(req, res) {
    var userCookie = req.cookies.uid;
    if (userCookie) {
        res.cookie('uid', userCookie.value, {maxAge: COOKIE_LIFETIME}); // Expires after 60 minutes
    }
}

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
        console.log("main.js: register: User " + username + " already exists");
        res.sendStatus(500);
    } else {
        uid = uidCounter;
        uidCounter++;
        userList[username] = {"uid": uid, "password": password};
        console.log("main.js: register: Created user " + username + " uid: " + uid);
        res.sendStatus(200);
    }

});

// should log ins
app.post('/login/:username/:password', function(req, res, next){
    var username = req.params.username;
    var password = req.params.password;
    if (username in userList){
        console.log("main.js: login: Logged in with user " + username);
        if (userList[username]['password'] === password) {
            res.cookie('uid', userList[username]['uid'], {maxAge: COOKIE_LIFETIME}); // Expires after 60 minutes
            res.sendStatus(200);
        } else {
            console.log("main.js: login: password doesn't match user " + username);
            res.sendStatus(403);
        }
    } else {
        console.log("main.js: login: user " + username + " doesn't exist");
        res.sendStatus(500);
    }
});


// Validate only logged in users access the next routes
app.use('/',function(req,res,next){
    if(req.cookies.uid) {
        renewCookie(req, res);
        next();
    }else{
        res.json("You are unauthorized. Please login.");
    }
});

// logout - basically delete login cookie
app.post('/logout', function(req, res, next){
    var userCookie = req.cookies.uid;
    if (userCookie){
        res.clearCookie('uid');
        console.log("main.js: logout: Logged out successfully");
        res.sendStatus(200);
    } else {
        console.log("main.js: logout: No cookie found, user is already logged out");
        res.sendStatus(500);
    }
});

// Should add the json item to the items-list
app.post('/item/', function(req, res, next){
    itemList[parseInt(req.body.id)] = req.body.data;
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
    var itemID = parseInt(req.params.id);
    if (itemID in itemList){
        res.json({"id": itemID, "data": itemList[itemID]})
    } else {
        res.sendStatus(404);
    }
});

// delete the item with the right id or 404 if no such an item
app.delete('/item/:id', function(req, res, next){
    var itemID = parseInt(req.params.id);
    if (itemID in itemList){
        delete itemList[itemID];
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// (item from type json in the HTTP body) overwrite the properties values of the item with the same id or 404 if no such an item
app.put('/item/', function(req, res, next){
    renewCookie(req, res);
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
