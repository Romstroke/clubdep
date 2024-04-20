const fs = require("fs");

const express = require('express');
const app = express();
const PORT = 3000;

app.listen(3000, () => console.log("Servidor escuchando Puerto: " + PORT));


//ruta para servir el front

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
});

//funcion que lee el json

// 1. Crear una ruta que reciba el nombre y precio de un nuevo deporte, lo persista en un archivo JSON
// (3 Puntos). Validar en el backend que se reciben los parámetros necesarios o requeridos y en el
// tipo adecuado, debe validarse que no se repitan los nombres de los deportes. Manejar esta ruta
// con queryStrings.

// Cargar los deportes desde el archivo JSON si existe
if (!fs.existsSync('deportes.json')) {
    try {
        let deportes =
        {
            deportes: []
        };

        const data = fs.writeFileSync('deportes.json', JSON.stringify(deportes));
        deportes = JSON.parse(data);
    } catch (err) {
        console.error('Error al cargar los deportes:', err);
    }
}

app.get('/agregar', (req, res) => {
    const { nombre, precio } = req.query;

    const data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));

    const deporteExistente = data.deportes.filter(deporte => deporte.nombre === nombre);

    if (deporteExistente.length > 0) {
        return res.status(400).send('El deporte ya existe'); //arreglar aqui el manejo de errores
    }

    const nuevoDeporte = { nombre, precio };
    data.deportes.push(nuevoDeporte);
    console.log('ingresados: ', data.deportes);
    fs.writeFileSync('deportes.json', JSON.stringify(data));

    res.send(
        {
            status: 200,
            error: "false",
            msg: "Deporte almacenado con éxito",
            datos: data
        })

});

// 2. Crear una ruta que al consultarse devuelva en formato JSON todos los deportes
// registrados (2 Puntos).

app.get('/deportes', (req, res) => {
    const data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
    res.json(data);
});