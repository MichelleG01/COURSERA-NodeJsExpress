var Bicicleta = require ('../../models/bicicleta');

//nos traemos la librería request:
var request = require('request');

//Incorporamos el servidor. Cuando comiencen los test, que se ponga en activo, y cuando termine los test, 
//se apaga el server para asi no estar pendientes del estado del servidor al hacer el test
var server = require("../../bin/www")

//Codigo para testeart el método GET
describe ('Bicicleta API', () => {

    describe ('GET BICICLETAS /', () => {
        it('Status 200', () => {
            expect(Bicicleta.allBicis.length).toBe(0);

            var a = new Bicicleta (1, 'negro', 'urbana', [-34.6012424, -58.3861497]);
            Bicicleta.add(a);

            //ejecutamos un get
            request.get('http://localhost:3000/api/bicicletas', function(error, response, body){
                expect(response.statusCode).toBe(200);
            });

        });
    });

    //Codigo para testeart el método POST
    describe ('POST BICICLETAS /create', () => {
        it('STATUS 200', (done) => { //le pasamos como parametro una variable que es un callback
            var headers = {'content-type' : 'application/json'};
            //el objeto json ya como un string
            var aBici = '{ "id": 10, "color":"rojo", "modelo" : "urbana", "lat": -34, "lng": -54 }';

            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicicletas/create',
                body: aBici
                
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                expect(Bicicleta.findById(10).color).toBe("rojo");
                done(); //ejecutamos el callback 
                /*Este done es lo que espera Jasmine para finalizar el test. Es 
                decir, el test se puede cortar por timeout, y cuando testeamos APIs muchas veces pasa. 
                Pero salvo esa excepción, hasta que no se ejecute done, el test no termina. 
                ¿Qué ganamos con eso? Como es asincrónico este request, y 
                todo lo que hacemos en Node.js, puede pasar que si nosotros no ponemos el done, se 
                manda a ejecutar al request, y después el test termina sin haber obtenido el resultado del request. */
            });
    
        });
    });

});


// se puede testear también el DELTE y el UPDATE con una logica similar a la de arriba**