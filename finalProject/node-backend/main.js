var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var consts = require('./consts');

// var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

function renewCookie(req, res) {
    var userCookie = req.cookies.uid;
    if (userCookie) {
        res.cookie('uid', userCookie.value, {maxAge: consts.COOKIE_LIFETIME}); // Expires after 60 minutes
    }
}

function isUserExists(user) {
    if (user in userList)
        return true;
    console.log("Couldn't find user ", user);
    return false
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

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'react-client/build')));
//app.use('/public', express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);

var uidCounter = 1;
var workoutIDCounter = 0;
var exerciseIDCounter = 0;
var userList = {};
var workoutList = [];

// Add admin user
userList.admin = {
    password: 'admin',
    uid: 0
};

// should add user/password to the user-list
app.post('/register/:username/:password', function(req, res, next){
    var username = req.params.username;
    username = username.toLowerCase();
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
    username = username.toLowerCase();
    var password = req.params.password;
    if (username in userList){
        console.log("main.js: login: Logged in with user " + username);
        if (userList[username]['password'] === password) {
            res.cookie('uid', userList[username]['uid'], {maxAge: consts.COOKIE_LIFETIME}); // Expires after 60 minutes
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
app.post('/logout/', function(req, res, next){
    var userCookie = req.cookies.uid;
    if (userCookie){
        console.log("main.js: logout: Logged out successfully");
        res.clearCookie('uid');
        res.sendStatus(200);
    } else {
        console.log("main.js: logout: No cookie found, user is already logged out");
        res.sendStatus(500);
    }
});

// logout - basically delete login cookie
app.delete('/deleteAccount/:user', function(req, res, next){
    let uid = req.cookies.uid;
    let user = req.params.user;
    if (uid){
        delete userList[user];
        let userWorkouts = workoutList.filter(workout => workout.user == user);
        for(i = 0; i < userWorkouts.length; i++){
            workout = userWorkouts[i];
            index = workoutList.indexOf(workout);
            if (index > -1) {
                workoutList.splice(index, 1);
            }
        }
        res.clearCookie('uid');
        res.sendStatus(200);
    } else {
        res.sendStatus(500);
    }
});


app.get('/getExercises/', function(req, res, next){
    console.log("main.js: createWorkout: getting all possible exercises");
    res.json(consts.POSSIBLE_EXERCISES);
});


// Should add the json item to the items-list
app.post('/addExercise/', function(req, res, next){
    var workout_id = req.body.workout_id;
    var workout = workoutList.find(workout => workout.id == workout_id);
    if (workout) {
        workout.exercises[exerciseIDCounter] = {
            ex_id: req.body.ex_id,
            ex_name: consts.POSSIBLE_EXERCISES[req.body.ex_id],
            sets: req.body.sets,
            reps: req.body.reps,
            weight: req.body.weight
        };
        exerciseIDCounter++;
        res.sendStatus(200);
    }
    else
        res.sendStatus(404);
});

app.get('/getWorkouts/:user', function(req, res, next){
    console.log("main.js: getWorkouts: getting all workouts");
    user = req.params.user;
    if (!isUserExists(user))
        res.sendStatus(404);
    else{
        var workoutForUser = workoutList.filter(workout => workout.user == user);
        // Prevent caching and 304 responses
        res.setHeader('Last-Modified', (new Date()).toUTCString());
        res.json(workoutForUser);
    }

});

app.get('/getSharedWorkouts/:user', function(req, res, next){
    console.log("main.js: getSharedWorkouts: getting all workouts");
    user = req.params.user;
    if (!isUserExists(user))
        res.sendStatus(404);
    else
        // Prevent caching and 304 responses
        res.setHeader('Last-Modified', (new Date()).toUTCString());
        res.json(workoutList.filter(workout => workout.shared_with === user))

});

// Should add the json item to the items-list
app.post('/createWorkout/', function(req, res, next){
    workout = req.body;
    workoutList.push({
        id: workoutIDCounter,
        user: workout.user,
        title: workout.title,
        date: workout.date,
        goals: workout.goals,
        exercises: {},
        shared_with: ''
    });
    workoutIDCounter++;
    res.sendStatus(200);
});

// delete the item with the right id or 404 if no such an item
app.delete('/deleteWorkout/:id', function(req, res, next){
    var workoutID = parseInt(req.params.id);
    var workout = workoutList.find(workout => workout.id == workoutID);
    if (workout) {
        index = workoutList.indexOf(workout);
        if (index > -1) {
            workoutList.splice(index, 1);
        }
        res.sendStatus(200);
    }
    else
        res.sendStatus(404);
});

// delete the item with the right id or 404 if no such an item
app.delete('/deleteExercise/:workout_id/:ex_id', function(req, res, next){
    var workout_id = parseInt(req.params.workout_id);
    var ex_id = parseInt(req.params.ex_id);
    var workout = workoutList.find(workout => workout.id == workout_id);
    if (workout) {
        delete workout.exercises[ex_id];
        res.sendStatus(200);
    }
    else
        res.sendStatus(404);
});

// Should add the json item to the items-list
app.post('/shareWorkout/', function(req, res, next){
    var workout_id = req.body.workout_id;
    var userToShare = req.body.userToShare;
    if (!isUserExists(userToShare))
        res.sendStatus(404);
    else {
        var workout = workoutList.find(workout => workout.id == workout_id);
        if (workout) {
            workout.shared_with = userToShare;
            res.sendStatus(200);
        }
        else
            res.sendStatus(403);

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

// Listen on a given port or 5000
var port = process.env.PORT || 5000;
app.listen(port);

console.log(`FiTotal server listening on ${port}`);

module.exports = app;
