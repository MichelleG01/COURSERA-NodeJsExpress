//constate que no cambia de estado
const http = require('http');
//La incorporación de módulos la hacemos con el método require y entre paréntesis le pasamos el nombre del módulo
/* Lo vamos a correr sobre el framework de Node,
por lo tanto ya lo va a poder ubicar, ya está dentro de nuestro sistema de este paquete, no hay que instalarlo, 
no hay que hacer nada. Simplemente lo vamos a incorporar.*/

const hostname = '127.0.0.1';
const port = 3000;

//creamos una instancia del servidor
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hola Mundo...');
  });
  
  server.listen(port, hostname, () => {
      /*Prestá atención a que esto no es comilla simple ni comilla doble, es como un acento invertido es el 
      que precisa el lenguaje para poder interpretar el string con comandos de escape para poner variables */
    console.log(`El servidor se está ejecutando en http://${hostname}:${port}/`);
  });