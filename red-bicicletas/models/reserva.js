var mongoose = require ('mongoose');

//utilizamos librería moment ( se instala con npm install moment)
//nos permite trabajar con las fechas
var moment = require('moment');
var Schema = mongoose.Schema;

var reservaSchema = new Schema({
    desde: Date,
    hasta: Date,
    bicicleta: {type: mongoose.Schema.Types.ObjectId, ref: 'Bicicleta'},//lo guardamos como referencia 
    //para querer acceder más adelante al usuario que esta haciendo la reserva
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'},// igual

    /*Internamente el documento lo que va a guardar es una referencia del objeto, es decir ese id que 
    tienen los documentos. El id no lo especificamos en ningún lado sino que Mongo lo agrega directamente. */
});

//metodo de instancia para saber cuantos dias estan reservando
reservaSchema.methods.diasDeReserva = function(){
    return moment(this.hasta).diff(moment(this.desde), 'days') + 1;//le sumo uno para considerar que son días, no es necesario

}

module.exports = mongoose.model('Reserva', reservaSchema);