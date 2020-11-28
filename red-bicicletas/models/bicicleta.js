//defino la variable Bicicleta que vamos a definirla como una funcion
var Bicicleta = function (id, color, modelo, ubicacion) { //este es como el constructor del objeto
    //atributos
    this.id = id;
    this.color = color;
    this.modelo= modelo;
    this.ubicacion = ubicacion;   
}

/*Se intenta hacer un modelo orientado a objetos bajo el paradigma del "prototipado", son modelos de prototipos. 
Entonces, cada objeto conoce su prototipo y se puede acceder enviándole un mensaje "prototype". */

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

/*var a = new Bicicleta (1, 'rojo', 'urbana', [-34.6012424, -58.3861497]);
var b = new Bicicleta (2, 'blanco', 'urbana', [-34.596932, -58.3808287]);
var c = new Bicicleta (3, 'gris', 'urbana', [-34.596732, -58.3808257]);

Bicicleta.add(a);
Bicicleta.add(b);
Bicicleta.add(c);*/

module.exports = Bicicleta; //Usamos el exports para que otro modulo pueda importar Bicicleta