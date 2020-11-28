var express = require('express');
var router = express.Router(); //maneja  las rutas

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' }); //le indicamos que renderice, que genere el html
});

module.exports = router;
