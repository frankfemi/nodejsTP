var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
var io = require('socket.io')(http);
var http = require('http').Server(app);


// Nouveau code
var mongo = require('mongodb');
var monk = require('monk');
//Pour me connecter à ma base données du nom de tpdb
var db = monk('localhost:27017/tpdb');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Rendre la Bdd accessible à notre "router"
app.use(function(req,res,next){
  req.db = db;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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






/**
 * Liste des utilisateurs en train de saisir un message
 */
var typingUsers = [];

 /**
   * Utilisateur connecté à la socket
   */
  var loggedUser;

  io.on('connection', function (socket) {

    /**
    * Connexion d'un utilisateur via le formulaire
    */
   socket.on('user-login', function (loggedUser) {
     console.log('user logged in : ' + loggedUser.username);
     user = loggedUser;
   });
 
 
   /**
    * Déconnexion d'un utilisateur : broadcast d'un 'service-message'
    */
   socket.on('disconnect', function () {
     if (loggedUser !== undefined) {
       console.log('user disconnected : ' + loggedUser.username);
       var serviceMessage = {
         text: 'User "' + loggedUser.username + '" disconnected',
         type: 'logout'
       };
       socket.broadcast.emit('service-message', serviceMessage);
     }
   });
 
     /**
    * Connexion d'un utilisateur via le formulaire :
    *  - sauvegarde du user
    *  - broadcast d'un 'service-message'
    */
   socket.on('user-login', function (user) {
     loggedUser = user;
     if (loggedUser !== undefined) {
       var serviceMessage = {
         text: 'User "' + loggedUser.username + '" logged in',
         type: 'login'
       };
       socket.broadcast.emit('service-message', serviceMessage);
     }
   });
 
   /**
    * Réception de l'événement 'start-typing'
    * L'utilisateur commence à saisir son message
    */
   socket.on('start-typing', function () {
     // Ajout du user à la liste des utilisateurs en cours de saisie
     if (typingUsers.indexOf(loggedUser) === -1) {
       typingUsers.push(loggedUser);
     }
     io.emit('update-typing', typingUsers);
   });
 
   /**
    * Réception de l'événement 'stop-typing'
    * L'utilisateur a arrêter de saisir son message
    */
   socket.on('stop-typing', function () {
     var typingUserIndex = typingUsers.indexOf(loggedUser);
     if (typingUserIndex !== -1) {
       typingUsers.splice(typingUserIndex, 1);
     }
     io.emit('update-typing', typingUsers);
   });
 
   /**
    * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
    */
    socket.on('chat-message', function (message) {
     message.username = loggedUser.username; // On intègre ici le nom d'utilisateur au message
     io.emit('chat-message', message);
     console.log('Message de : ' + loggedUser.username);
   });
 });



module.exports = app;
