//importamos el modulo de express
var express = require('express');
//modulo ruteador de express
var router = express.Router();

// el controlador sale desde la ruta:
var bicicletaController = require('../../controllers/api/bicicletaControllerAPI');
 
router.get('/', bicicletaController.bicicleta_list);

//ruta/path para poder hacer el create de la API, en este caso será un post
router.post('/create', bicicletaController.bicicleta_create);

//ruta delete
router.delete('/delete', bicicletaController.bicicleta_delete);

//exporto el modulo
module.exports = router;