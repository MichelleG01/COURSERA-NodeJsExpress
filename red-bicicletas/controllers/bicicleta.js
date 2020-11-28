//importamos el modulo modelo de Bicicleta:
var Bicicleta = require('../models/bicicleta');


/*lo que hacemos aquí es renderizar, justamente, la vista del listado de bicicletas con el objeto de 
"bicicleta.allBicis", que son las bicicletas que hemos agregado antes.*/
exports.bicicleta_list = function(req, res){
    res.render('bicicletas/index', {bicis: Bicicleta.allBicis}); 
    // el render busca en la carpeta de vistas (View) en la carpeta "bicicletas", 
    //un index.pug(que debe estar creado o hay que irlo a crear)
}

//Controllers del create(vista create.pug). consta de 2 momentos (solicitud de hacer un create 
//y confirmación del create(cuando recibamos los atributos y propiedades))
//Controlador para el momento 1. Solicitud(GET)
exports.bicicleta_create_get = function(req, res) {
    res.render('bicicletas/create');
}
//Controlador para el momento 2. Confirmación(POST)
exports.bicicleta_create_post = function(req, res){
    var bici = new Bicicleta(req.body.id, req.body.color, req.body.modelo); // Como los atributos id,color y 
    //modelo, vienen desde el body del formulario, se debe manejar esa sintaxis
    bici.ubicacion = [req.body.lat, req.body.lng]; //guardo en Array
    Bicicleta.add(bici); //guarda en una coleccion global

    res.redirect('/bicicletas'); //apenas termine, redirijo a bicicletas.
}

//Controlador DELETE
exports.bicicleta_delete_post = function(req, res){
    Bicicleta.removeById(req.body.id);

    res.redirect('/bicicletas');
}

//Controller UPDATE (consta de 2 métodos también:  get y post)
exports.bicicleta_update_get = function(req, res) {
    var bici = Bicicleta.findById(req.params.id);//encuentra la bici que hay que modificar, recibe por PARAMETROS(id en este caso)*

    res.render('bicicletas/update',{bici}); //recibe la bici que encontramos en la linea anterior. YA NO SE USA EL BODY, porque vendrá por parámetros***
}

exports.bicicleta_update_post = function(req, res){
    var bici = Bicicleta.findById(req.params.id); //primero encuentra
    //despues de encontrarlo, le modificamos todos los atributos de acuerdo a lo que venga, AHORA SI EN EL BODY
    bici.id = req.body.id;
    bici.color =req.body.color;
    bici.modelo =req.body.modelo;
    bici.ubicacion = [req.body.lat, req.body.lng]; //guardo en Array
    

    res.redirect('/bicicletas'); //apenas termine, redirijo a bicicletas para comparar si se hizo la actualizacion
}