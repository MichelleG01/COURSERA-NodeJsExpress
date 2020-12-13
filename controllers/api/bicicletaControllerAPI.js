var Bicicleta = require('../../models/bicicleta');
//const { bicicleta_list } = require('../bicicleta');


//Definimos el primer metodo para obtener el listado, con el estado 200 que indica que todo está OK
//devolvemos un objeto json.
/*exports.bicicleta_list = function(req, res){
    res.status(200).json({
        bicicletas: Bicicleta.allBicis
    });
}*/

exports.bicicleta_list = function (req,res){
    Bicicleta.allBicis(function(err,bicis){
        res.status(200).json({Bicicletas:bicis});
    });
}

//Controller  para CREATE API (No se pudo probar en el programa postman.com porque necesitaba unos permisos)

/*exports.bicicleta_create = function(req, res){
    var bici = new Bicicleta(req.body.id, req.body.color, req.body.modelo);//creamos una nueva bici sin la ubicacion
    bici.ubicacion = [req.body.lat, req.body.lng];//definimos la ubcicacion con el array lat, long

    Bicicleta.add(bici); // agregamos a la coleccion global

    res.status(200).json({  //le devuelvo el objeto creado para ver si hay correspondencia con lo que se creo
        bicicleta: bici
    });
}*/

exports.bicicleta_create = function(req, res){
    var bici = new Bicicleta({ code: req.body.id, color: req.body.color, 
        modelo: req.body.modelo, ubicacion: [req.body.lat, req.body.lng] });
    
    bici.save(function(err){
        res.status(200).json(bici);
    });
}

//Controller delete
exports.bicicleta_delete= function(req, res){
    Bicicleta.removeById(req.body.id);
    res.status(204).send();
}