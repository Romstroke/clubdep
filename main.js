const fs = require("fs");

const express = require('express');
const app = express();
const PORT = 3000;

app.listen(3000, ()=> console.log("Servidor escuchando Puerto: "+PORT));


//ruta para servir el front

app.get('/', (req,res) => {
    res.sendFile(__dirname + "/index.html")
});

// 1. Crear una ruta que reciba el nombre y precio de un nuevo deporte, lo persista en un archivo JSON
// (3 Puntos). Validar en el backend que se reciben los parámetros necesarios o requeridos y en el
// tipo adecuado, debe validarse que no se repitan los nombres de los deportes. Manejar esta ruta
// con queryStrings.

app.get('/agregar', (req,res) => {

});