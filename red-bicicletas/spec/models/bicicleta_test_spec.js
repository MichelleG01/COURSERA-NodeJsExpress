var mongoose = require ('mongoose');
var Bicicleta = require('../../models/bicicleta');

//Test MONGO DB con mongoose
describe ('Testing Bicicleta', function(){
    beforeEach(function(done){
        var mongoDB = 'mongodb://localhost/testdb'; //setup, la configuración de la bb
        mongoose.connect(mongoDB, { useNewUrlParser: true }); //para ver que estamos logueados directamente

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open',function(){
            console.log('we are connected to test database!');
            done();
        });
    });

    afterEach(function(done){
        Bicicleta.deleteMany({}, function(err, succes){ //borramos toda la colleccion de la db
            if (err) console.log(err);
            mongoose.disconnect(err); 
            done();
        });
    });

    describe('Bicicleta.createInstance',() => {
        it ('crea una instancia de Bicicleta', () => {
            var bici = Bicicleta.createInstance(1, "verde", "urbana", [-34.5, -54.1]);

            expect(bici.code).toBe(1);
            expect(bici.color).toBe("verde");
            expect(bici.modelo).toBe("urbana");
            expect(bici.ubicacion[0]).toEqual(-34.5);
            expect(bici.ubicacion[1]).toEqual(-54.1);

        })
    });

    describe ('Bicicleta.allBicis', () => {
        it ('comienza vacia', (done) =>{
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0);
                done();
            });
            
        });
    });

    describe('Bicicleta.add', () =>{
        it('agrega solo una bici', (done) =>{ //agrega solo una bici
            var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"}); //creo una bici sin usar esquema
            Bicicleta.add(aBici, function(err, newBici){ //le paso la bici con el add

                if (err) console.log(err);
                Bicicleta.allBicis(function(err, bicis){// una vez hecho el add, le pido que la longitud sea=1 
                    //y el codigo del 1er elemto sea el de la bici que agregamos, es decir 1.
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toEqual(aBici.code);

                    done();
                });
            });
    
          
        });
    });

    describe('Bicicleta.findByCode', () =>{
        it('debe devolver la bici con code 1', (done) =>{ 
            Bicicleta.allBicis(function(error, bicis){
                expect(bicis.length).toBe(0);

                var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"}); 
                Bicicleta.add(aBici, function(err, newBici){ 
                    if (err) console.log(err);

                    var aBici2 = new Bicicleta({code: 2, color: "roja", modelo: "urbana"}); 
                    Bicicleta.add(aBici2, function(err, newBici){ 
        
                        if (err) console.log(err);
                        Bicicleta.findByCode(1, function(err, targetBici){
                            expect(targetBici.code).toEqual(aBici.code);
                            expect(targetBici.color).toEqual(aBici.color);
                            expect(targetBici.modelo).toEqual(aBici.modelo);
        
                            done();
                        });
                    });
                });
            });
        });
    });

});
//... FIN TEST MONGOOSE

/*
//Antes de cada test se ejecuta esto
//El siguiente método  de Jasmine, hace que cada Test inicialice el array vacio:
beforeEach(() => { Bicicleta.allBicis = [];  });

//beforeEach(() => console.log('testeando...') );
//beforeEach(function(){console.log('testeando…'); });

//EL siguiente codigo verifica si el arreglo de datos de bicicleta,js comienza o no vacío, se ejecuta con npm test
// y espera que sea(ToBE) = 0 
describe ('Bicicleta.allBicis', () => {
    it ('comienza vacia',() =>{
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

//El siguente, verifica si se agrega correctamente la bicicleta que se se le está pasando
describe('Bicicleta.add', () =>{
    it('agregamos una', () =>{
        expect(Bicicleta.allBicis.length).toBe(0);//Aca suponemos que la lista se encuentra vacía
        //si hubo algún test previo que modificó la lista de bicicletas, me puede llegar a tirar un 
        //error más adelante cuando chequee la cantidad que quede finalmente

        var a = new Bicicleta (1, 'rojo', 'urbana', [-34.6012424, -58.3861497]);
        Bicicleta.add(a);

        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(a);
    });
});

describe('Bicicleta.findById', () =>{
    it('debe devolver la bicicleta con id 1', () =>{
        expect(Bicicleta.allBicis.length).toBe(0);

        var bici = new Bicicleta (1, "verde", "montaña");
        var bici2 = new Bicicleta (2, "azul", "urbana");
        Bicicleta.add(bici);
        Bicicleta.add(bici2);

        var targetBici = Bicicleta.findById(1);
        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(bici.color);
        expect(targetBici.modelo).toBe(bici.modelo);
    });
});*/