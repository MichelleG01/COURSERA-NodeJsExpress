var express = require ('express');
var router =express.Router();
var tokenController = require ('../controllers/token');

router.get('/cofirmation/:token', tokenController.confirmationGet);

module.exports = router;