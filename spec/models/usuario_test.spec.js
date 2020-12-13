var mongoose = require('mongoose')
var Bicicleta = require('../../models/bicicleta')
var Reserva = require('../../models/reserva');
var Usuario = require('../../models/usuario');
// var {Usuario, Reserva} = require('../../models/usuario')

// recordar beforeEach afterEach son llamadas antes y después de Test

describe('Testing Usuarios', function () {

    beforeEach(function (done) {
        var mongoDB = 'mongodb://localhost/testdb'
        mongoose.connect(mongoDB, { useNewUrlParser: true });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function () {
        console.log('We are connected to test database');
        done();
        });
    });

    // Aquí podemos usar Promesas
    // Usamos cascada para eliminar todas las dependencias
    afterEach(function (done) {
                            //callback
        Reserva.deleteMany({}, function (err, success) {
            if (err) console.log(err);
            Usuario.deleteMany({}, function (err, success) {
                if (err) console.log(err);
                Bicicleta.deleteMany({}, (err, success) => {
                    if (err) console.log(err);
                    done();
                });
            });
        });
    });

    //Test
    describe('Cuando un Usuario reserva una bici', () => {
        it('debe existir la reserva', (done) => {
            //Create a user
            const usuario = new Usuario({ nombre: 'Prueba', email: 'test@test.com', password: '123456' });
            usuario.save();

            //Create a bicycle
            const bicicleta = new Bicicleta({ code: 1, color: "verde", modelo: "deportiva" });
            bicicleta.save();
    
            // fechas de reserva (reserva
            var hoy = new Date();
            var mañana = new Date();
            mañana.setDate(hoy.getDate() + 1);
        
            //Reservamos una bicicleta                        //callback
            usuario.reservar(bicicleta.id, hoy, mañana, (err, reserva) => {
    
                //Usando promises en lugar de la cascade
                //Explanation
                /*
                Reserva.find ({}) devuelve un objeto que contiene el método populate ('bicicleta')
                este retorna otro objeto que contiene el método populate ('usuario') finalmente el 3 objeto 
                tiene el método exec y este recibe una devolución de llamada
                */
               //esto es asincronico, por eso el promises le indica con el find que va a responder en algun momento
                Reserva.find({}).populate('bicicleta').populate('usuario').exec((err, reservas) => {
                    console.log(reservas[0]);
                    
                    //result that we expect
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                    done();

                });
            });
        });
    });

});

/* notas 
Mongoose tiene una alternativa más poderosa llamada populate (), que le permite hacer referencia a 
documentos de otras colecciones. */