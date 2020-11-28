//importamos el modulo de express
var express = require('express');
//modulo ruteador de express
var router = express.Router();

var bicicletaController = require('../controllers/bicicleta');

//definimos una nueva ruta, la ruta base
router.get('/', bicicletaController.bicicleta_list);
//ruta para el create.pug
router.get('/create', bicicletaController.bicicleta_create_get);
router.post('/create', bicicletaController.bicicleta_create_post);

//ruta para el DELETE, el :id dentro de la ruta, indica que es un parámetro
router.post('/:id/delete', bicicletaController.bicicleta_delete_post);

//ruta para UPDATE. el :id dentro de la ruta, indica que es un parámetro
router.get('/:id/update', bicicletaController.bicicleta_update_get);
router.post('/:id/update', bicicletaController.bicicleta_update_post);


//exporto el modulo
module.exports = router;