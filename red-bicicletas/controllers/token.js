var Usuario = require('../models/usuario');
var Token = require('../models/token');

module.exports = {
    confirmationGet: function(req, res, next){ //usamos el callback de la confirmacion del token
        //traemos el primero que encuentre con el "token" de parámetro.
        Token.findOne({ token: req.params.token}, function(err, token){
            if(!token) return res.status(400).send({ type: 'not-verified', msg:'No encontramos un usuario con este token..Quizá haya expirado y debas solicitarlo nuevamente'});
            
            Usuario.findById(token._userId, function(err, usuario){

                if (!usuario) return res.status(400).send({ msg:'No encontramos un usuario con este token'});

                if (usuario.verificado) return res.redirect('/usuarios');
                usuario.verificado = true;
                usuario.save(function(err){
                    if (err) { return res.status(500).send({msg: err.message });}
                    res.redirect('/');
                });
            });
        });
    },
}