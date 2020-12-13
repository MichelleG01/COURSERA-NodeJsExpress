//Para indicarle a MOngo que utilizaremos las variables de ambiente del archivo .env:
require('dotenv').config();

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
//agrego ruta Usuarios
var usuariosAPIRouter = require('./routes/api/usuarios');

//Defino variables para TOKEN y USUARIOS:
var usuariosRouter = require('./routes/usuarios');
var tokenRouter = require ('./routes/token');

//ya debe estar este archivo y esta carpeta creada:
const passport = require('./config/passport'); //para cookies y login se debe instalar : npm install passport --save
// y : npm install passport-local --save
const session= require('express-session'); //para login $ npm install express-session --save

//este objeto define cual es el MOTOR DE SESION que vamos a usar, DEBE IR ANTES DE VAR APP= EXPRESS()****
const store = new session.MemoryStore; // se guardará la sesion en memoria del servidor, NO EN MONGO DB. la
//desventaja de este tipo es que: en caso de que el servidor se resetee, los usuarios deberan logearse nuevamente

var app = express();

//configuracion de la cookie y la sesion, debe ir acá, luego de var app
app.use(session({
    cookie: { maxAge: 240 * 60 * 60 * 1000}, //defino el tiempo de duracion de la cookie ( 240H*1H*1m*1ms)= 10 días
    store: store, //donde voy a guardar
    saveUninitialized: true,
    resave: 'true', 
    secret: 'red_bicis_!!!***!"-!"-!"-!"-!"-!"-123123' //se utiliza para generar la encryptacion del identificador 
    //de la cookie, es como una semilla que se manda al servidor
  }));


//INICIO CONFIGURACION MONGO DB
//Traemos la referencia PARA USAR MONGO DB 
var mongoose = require('mongoose');
//const { promises } = require('fs');
const Usuario = require('./models/usuario');
//Cremos una variable para que tenga la conexión con la DB: //usar si estamos en ambiente de desarrollo
//var mongoDB = 'mongodb://localhost/red_bicicletas';
//Configuracion a conexion global DB - Si estamos en ambiente de produccion usar:
//var mongoDB = 'mongodb+srv://admin:BydetQFybBTMhNoz@red-bicicletas.ktudx.mongodb.net/<dbname>?retryWrites=true&w=majority';

//Si desplegamos en local se utiliza la db local pero al desplegar con heroku el identifica que la url de la db remota
//ya que se configuro previamente (Para que trabaje con el cluster en la nube, que está definido en el archivo .env)
var mongoDB = process.env.MONGO_URI;
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
//inicializacion de passport, debe ir luego del cookie parser***
app.use(passport.initialize());
app.use(passport.session()); //para session

app.use(express.static(path.join(__dirname, 'public')));


//para que se visualicen las vistas de Login
app.get('/login', function(req, res){
  res.render('session/login');//nos redirije a session
});
//para posteo de login, validaciones
app.post('/login', function(req, res, next){
  //passport que recibe el callback de Local Strategy(passport.js) enviando los parametros res, req, next
  passport.authenticate('local', function(err, usuario, info){
    if (err) return next(err);
    if (!usuario) return res.render('session/login', {info});
    req.logIn(usuario, function(err){
      if (err) return next(err);
      // si todo está bien redirigir a bicicleta
      return res.redirect('/');
    });
    
  })(req, res, next);
});

//para el logout
app.get('/logout', function(req, res){
  req.logOut();
  res.redirect('/');
});

//para el forgotpassword
app.get('/forgotpassword', function(req,res){
  res.render('session/forgotPassword');
});
app.post('/forgotPassword', function(req,res){
  Usuario.findOne({ email: req.body.email }, function (err, usuario){
    if (!usuario) return res.render('session/forgotPassword',{info: {message: 'No existe usuario con este password'}});

    usuario.resetPassword(function(err){
      if (err) return next(err);
      console.log('session/forgotPasswordMessage');
    });
    res.render('session/forgotPasswordMessage');

  });
});

//para resetar el password
app.get('resetPassword/:token', function(req, res, next){
  Token.findOne({ token: req.params.token}, function(err, token){
    if (!token) return res.status(400).send({ type: 'not-verified', msg: 'No existe un usuario verificado con este dato'});

    Usuario.findById(token._userId, function (err, usuario){
      if (!usuario) return res.status(400).send({msg: 'No existe usuario asociado a ese correo'});
      res.render('session/resetPassword', {errors: {}, usuario: usuario});
    });
  });
});
app.post('/resetPassword', function(req, res){
  if (req.body.password != req.body.confirm_password) {
    res.render('session/resetPassword', {errors: {confirm_password: { message: ' No coincide el password'}}});
    return;
  }
  Usuario.findOne({ email: req.body.email }, function (err, usuario){
    usuario.password = req.body.password;
    usuario.save(function(err){
      if (err){
        res.render('session/resetPassword',{errors: err.errors, usuario: new Usuario()});
    }else{
      res.redirect('/login');
    }});
  });
});


//para usuarios y token 
app.use('/', indexRouter);
app.use('/usuarios', usuariosRouter);
app.use('/token', tokenRouter);

//Para definir el uso del modulo
app.use('/', indexRouter); //definimos la ruta del index, ubica el modulo IndexRouter en la ruta raiz '/'
app.use('/users', usersRouter); // La aplicacion indica al servidor que escuche en esta ruta lo que se le va 
  //a informar el modulo de rutas, redirecciona y acciona los métodos creados allá
app.use('/bicicletas', loggedIn, bicicletasRouter );//esta ruta es especial para usuarios logeados, primero 
//se ejecuta el loggedIn, y si cumple, pasa a la pagina bicicletas. Seguriza la ruta

//le decimos que use la ruta api
app.use('/api/bicicletas', bicicletasAPIRouter);
//ruta API usuarios
app.use('/api/usuarios', usuariosAPIRouter);

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

//Funcion de seguridad(middleware para web) para vincular en las rutas privadas para usuarios logeados, 
//que si detecta un user NO logeado, lo redirecciona a /login
function loggedIn (req, res , next){
    if (req.user){
      next();
    }else{
      console.log('Usuario sin loguearse');
      res.redirect('/login');
    }
};

module.exports = app;
