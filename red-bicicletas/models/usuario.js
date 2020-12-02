var mongoose = require('mongoose');
var Reserva = require('./reserva');
var Schema = mongoose.Schema;
//creamos el esquema del usuaruio
var usuarioSchema = new Schema ({
    nombre: String,
});

//y le agregamos al esquema el metodo de la reserva
usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb){
    var reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta})
    console.log(reserva);
    reserva.save(cb);
}

module.exports = mongoose.model('Usuario', usuarioSchema);