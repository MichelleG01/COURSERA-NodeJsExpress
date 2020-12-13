//agregamos referencia mongoose para poder trabajar con ella:
var mongoose= require ('mongoose');
var Schema = mongoose.Schema; //Mongoose requiere el uso de esquemas

//creo el esquema al cual se le pasará un JSON
var bicicletaSchema = new Schema({
    code: Number, //representa el id, no se pone "id" porque es una variable reservada en MongoDb
    color: String,
    modelo: String,
    ubicacion: { //ubicacion es de tipo lista de numeros
        type: [Number], index: { type: '2dsphere', sparse: true } //index/indice es una variable de tipo geografico
        /* cuando hagamos una búsqueda por ubicación, vamos a utilizar ese índice y lo vamos a encontrar 
        más rápido. ¿Cuántos índices puedes crear? Los que quieras. El costo es que ocupa más espacio, y 
        estos índices hay que mantenerlos. */
    }
});

//Metodos de instancia de mongoose:
//crear instancia del esquema MOngo DB(se hace para que el esquema pueda iteractuar con los atributos de la BD)
bicicletaSchema.statics.createInstance = function (code, color, modelo, ubicacion) {
    /* no hacemos new bicicleta porque estamos como esquema, entonces obtenemos una instancia de mongo,
     del esquema o sea del objeto conectado con su base de datos para después empezar a operar 
     con todos los atributos que nos ofrece */
    return new this({
        code : code,
        color : color,
        modelo : modelo,
        ubicacion : ubicacion
    });
};

/*cada esquema tiene una propiedad que es methods, son todos los métodos de instancia, es decir lo que va a 
responder instancias de este esquema, es decir la bicicleta*/
bicicletaSchema.methods.toString = function(){
    return 'code: ' + this.code + ' | color: ' + this.color;
};

/*statics significa que lo estoy agregando directo al modelo, es decir cuando me traigan el modelo voy a hacer 
bicicleta.allbicis, le paso un callback y va a hacer la búsqueda, que en este caso son todas las bicicletas */
bicicletaSchema.statics.allBicis = function(cb){ 
    return this.find({}, cb); //como no filtro traigo todas las bicicletas, me traigo el Json vacío directamente
};

bicicletaSchema.statics.add = function(aBici, cb){
    this.create(aBici, cb);
};

bicicletaSchema.statics.findByCode = function(aCode, cb){
    return this.findOne({code: aCode}, cb); //traigo el primero que encuentre
    //Y como criterio de filtrado, le pasamos un JSON que tiene propiedad code
};

bicicletaSchema.statics.removeByCode = function(aCode, cb){
    return this.deleteOne({code: aCode}, cb);
};

//finalmente, exportamos el modelo anterior(bicicleta) el cual utilizara el anterior esquema
 module.exports = mongoose.model('Bicicleta', bicicletaSchema);

 /*
 //defino la variable Bicicleta que vamos a definirla como una funcion
var Bicicleta = function (id, color, modelo, ubicacion) { //este es como el constructor del objeto
    //atributos
    this.id = id;
    this.color = color;
    this.modelo= modelo;
    this.ubicacion = ubicacion;   
}

//Se intenta hacer un modelo orientado a objetos bajo el paradigma del "prototipado", son modelos de prototipos. 
//Entonces, cada objeto conoce su prototipo y se puede acceder enviándole un mensaje "prototype". 

Bicicleta.prototype.toString = function (){ //creamos una funcion toString
    return 'id: ' + this.id + " | color: " + this.color;
}

Bicicleta.allBicis = []; //Array para guardar las bicicletas, para aun no utilizar DB
Bicicleta.add = function(aBici){
    Bicicleta.allBicis.push(aBici);
}

//metodo para CRUD, DELETE(2 metodos necesarios):
//primero encontramos lo que queremos borrar
Bicicleta.findById = function(aBiciId){
    var aBici = Bicicleta.allBicis.find(x => x.id == aBiciId); //buscamos por id
    if (aBici)//si encuentra la bici, la devuelve
        return aBici;
    else//sino, manda un error
        throw new Error(`No existe una bicicleta con el id $(aBiciId)`); //para interpolacióm(mostrar variable dentro de mensaje: $(aBiciId)), es indispensable escribir dentro de comillas francesas``.
}
//segundo, removemos con base a lo que nos retorna el metodo anterior:
Bicicleta.removeById = function(aBiciId){
    for(var i = 0; i < Bicicleta.allBicis.length; i++){ //recorro el arreglo 
        if (Bicicleta.allBicis[i].id == aBiciId){//si el id coincide con la posicion del arreglo:
            Bicicleta.allBicis.splice(i, 1); //splice es el metodo que finalmente borra el elemto en la posicion i
            break;
        }
    }
}

var a = new Bicicleta (1, 'rojo', 'urbana', [-34.6012424, -58.3861497]);
var b = new Bicicleta (2, 'blanco', 'urbana', [-34.596932, -58.3808287]);
var c = new Bicicleta (3, 'gris', 'urbana', [-34.596732, -58.3808257]);

Bicicleta.add(a);
Bicicleta.add(b);
Bicicleta.add(c);

module.exports = Bicicleta; //Usamos el exports para que otro modulo pueda importar Bicicleta
*/