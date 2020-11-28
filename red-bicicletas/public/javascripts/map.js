//Codigo Leaflet, documentacion
//.setView set el map en esa coordenada, 13 -> nivel de zoom
var map = L.map('main_map').setView([-34.6012424,-58.3861497], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ //le pasamos un json especificando la prop attribution
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//se agregan marcadores en el mapa
L.marker([-34.6012424,-58.3861497]).addTo(map);
L.marker([-34.596932,-58.3808287]).addTo(map);
L.marker([-34.599564,-58.3778777]).addTo(map);