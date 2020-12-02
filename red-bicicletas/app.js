var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bicicletasRouter = require('./routes/bicicletas');
//defino ruta API
var bicicletasAPIRouter = require('./routes/api/bicicletas');

var app = express();

//agrego ruta Usuarios
//var usuariosAPIRouter = require('./routes/api/usuarios');

//INICIO CONFIGURACION MONGO DB
//Traemos la referencia PARA USAR MONGO DB 
var mongoose = require('mongoose');
//const { promises } = require('fs');
//Cremos una variable para que tenga la conexión con la DB:
var mongoDB = 'mongodb://localhost/red_bicicletas';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection; //guardo la conexión en db
db.on('error', console.error.bind(console, 'MongoDB conection error: '));
//...FIN  CONFIGURACION MONGO DB

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//definimos dónde está la carpeta de contenido estático, que es la public
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Para definir el uso del modulo
app.use('/', indexRouter); //definimos la ruta del index
app.use('/users', usersRouter);
app.use('/bicicletas', bicicletasRouter );
//le decimos que use la ruta api
app.use('/api/bicicletas', bicicletasAPIRouter);

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

module.exports = app;
