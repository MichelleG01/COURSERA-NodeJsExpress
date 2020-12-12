var mongoose = require('mongoose');
var Reserva = require('./reserva');
var Schema = mongoose.Schema;

const mailer = require('../mailer/mailer');
const saltRounds = 10; //defino variable para darle aletoreidad al algoritmo de  encriptacion (hashSync)
const bcrypt = require ('bcrypt'); //Modulo que nos permite encryptar stings. Debemos instalarlo porque NO ESTÁ en el Package.json (npm install bcrypt --save)
const uniqueValidator = require('mongoose-unique-validator'); // se instala con npm install mongoose-unique-validator --save

const crypto = require('crypto'); //para el TOKEN
const Token = require ('../models/token');

//Funcion con expresión regular para validar email:
const validateEmail = function(email){
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  //objeto regex, expresion regular
    return re.test(email);
};

//creamos el esquema del usuaruio con los parámetros necesarios para la autenticacion Two Factor
var usuarioSchema = new Schema ({
    nombre:{
        type: String,
        trim: true, //borra los espacios del inicio de texto
        required: [true, 'El nombre es obligatorio']
    },
    email:{
        type: String,
        trim: true, //borra los espacios del inicio de texto
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        unique: true, //no esta definido en mongonose entonces se instala. Ya que el email debe ser unico porque sera parte de la validación two-factor
        validate: [validateEmail, 'Por favor ingrese un email valido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/] //corre a nivel MONGODB
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },

    passwordResetToken: String, //el toquen se asociará a una cuenta de correo una vez se registre el usuario, deben estar encriptados
    passwordResetTokenExpires: Date, 
    verificado: {
        type: Boolean,
        default: false
    }

});

//Agrego plugin Validator al Esquema (unique):
usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} ya existe con otro usuario'});//hace referencia al PATH del email
/*Los plugins son como módulos o librerías que no son parte directa de Mongoose sino que hay que incorporarlas
para hacer cosas que las librerías no lo permitan, como puede ser esta validación del unique y hay varias validaciones más y otras*/


//Funcion para que antes de guardar(save) encripte las claves 
usuarioSchema.pre('save', function(next){ //callback sobre el save
    if (this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, saltRounds); //Salt le da una aleatoreidad a la encryptacion
    }
    next(); //para que continue el save
 });

//agregamos comparacion del password a ver si el password es valido
//Para el login se pregunta si l password es valido y se compara con la encryptacion del mismo password, a ver si coincide 
usuarioSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

//y le agregamos al esquema el metodo de la reserva
usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb){
    var reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta})
    console.log(reserva);
    reserva.save(cb);
}

//metodo para enviar email de bienvenida a usuarios nuevos
usuarioSchema.methods.enviar_email_bienvenida = function(cb) {
    //especificamos TOKEN usando la librería crypto requerida arriba
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    //creamos una constante con el email que le corresponde al usuario:
    const email_destination = this.email;
    //persistimos los datos
    token.save(function (err){ //le pasamos como callback una función que recibiría el error, en caso de que exista
        if (err) { return console.log(err.message);}

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Verificacion de cuenta', //token.token es el token encryptado para que no muestre el original en la URL y no se pueda hackear
            text: 'Hola,\n\n' + 'Por favor, para verificar su cuenta haga click en este link: \n' + 'http://localhost:3000' + '\/token/confirmation\/'+ token.token + '.\n'
        };
        //una vez tengamos instalada la librería mailer y tengamos la carpeta con el codigo losto
        mailer.sendMail(mailOptions, function (err){
            if (err) { return console.log(err.message); } //esto es asincronico, si hay un error le logea por consola y el metodo se finaliza
            //sino hay un error
            console.log('Se ha enviado un email de bienvenida a:' + email_destination + '.');
        });
    });
    
}

usuarioSchema.methods.resetPassword = function (cb) {
    const token = new Token({ _userId: this.id, token: crypto.randomBytes(16).toString('hex') });
    const email_destination = this.email;
    token.save(function (err) {
    if (err) { return cb(err); }

    var mailOptions = {
        from: 'no-reply@redbicicletas.com',
        to: email_destination,
        subject: 'Reseteo de password',
        text: 'Hola,\n\n' + 'Por favor, haga click en este link para resetear su password : \n'
        + 'http://localhost:3000' + '\/resetPassword\/' + token.token + '\n'
    };

    mailer.sendMail(mailOptions, function (err) {
        if (err) { return cb(err); }

        console.log('Se ha enviado un email para resetar la password a  : ' + email_destination + '.');
    });

    cb(null);
    });
};
    

module.exports = mongoose.model('Usuario', usuarioSchema);