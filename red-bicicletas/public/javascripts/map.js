//Codigo Leaflet, documentacion
//.setView set el map en esa coordenada, 13 -> nivel de zoom
var map = L.map('main_map').setView([-34.6012424,-58.3861497], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ //le pasamos un json especificando la prop attribution
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//se agregan marcadores en el mapa
/*L.marker([-34.6012424,-58.3861497]).addTo(map);
L.marker([-34.596932,-58.3808287]).addTo(map);
L.marker([-34.599564,-58.3778777]).addTo(map);*/

//metodo ajax para hacer llamada asincrónica a la web. success: es un callback
//este metodo se encarga de graficar las coordenadas de la bici, segun su id
$.ajax({
        dataType: "json",
        url:"api/bicicletas",
        success: function(result){
            console.log(result);
            result.bicicletas.forEach(function(bici){
                L.marker(bici.ubicacion, {title: bici.id}).addTo(map);
                        
            });
        }
    })