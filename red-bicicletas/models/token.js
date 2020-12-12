const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Guardamos una referencia con el esquema de usuario
const TokenSchema = new Schema({
    //em mongo se guarda el ID del usuario, cuando hacemos un findID, mongoose crea las instancias de los objetos y traerá el usuario entero en el token 
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref :'Usuario'},//guardamos el Id, de tipo Objeto, que hace referencia a 
    token: { type: String, required: true},
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200}//guardamos fecha de creacion y el esquema se elimina en: expires: 43200
});

module.exports = mongoose.model('Token',TokenSchema);