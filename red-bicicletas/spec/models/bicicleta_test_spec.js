var Bicicleta = require('../../models/bicicleta');

//Antes de cada test se ejecuta esto
//El siguiente método  de Jasmine, hace que cada Test inicialice el array vacio:
beforeEach(() => { Bicicleta.allBicis = [];  });

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
});