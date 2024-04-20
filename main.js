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

function leerJson() {
    const data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
    return data;
}

// 1. Crear una ruta que reciba el nombre y precio de un nuevo deporte, lo persista en un archivo JSON
// (3 Puntos). Validar en el backend que se reciben los parámetros necesarios o requeridos y en el
// tipo adecuado, debe validarse que no se repitan los nombres de los deportes. Manejar esta ruta
// con queryStrings.

let deportes = { deportes: [] };

//crear deportes.json 
if (!fs.existsSync('deportes.json')) {
    try {
        const data = fs.writeFileSync('deportes.json', JSON.stringify(deportes));
        deportes = JSON.parse(data);
    } catch (err) {
        console.error('Error al cargar los deportes:', err);
    }
}

app.get('/agregar', (req, res) => {
    const { nombre, precio } = req.query;

    const data = leerJson();

    //para validar que se entregan ambos parametros

    if (nombre === "") {
        return res.send('Debe ingresar un nombre al deporte');
    }

    if (precio === "") {
        return res.send('Debe ingresar un precio al deporte');
    }

    //para validar que el precio sea un número y no negativo

    // Validar que el precio sea un número
    if (precio <= 0 || isNaN(parseFloat(precio))) {
        return res.send('El precio del deporte debe ser un número positivo');
    }


    //para que no se repita
    const deporteExistente = data.deportes.filter(deporte => deporte.nombre === nombre);

    if (deporteExistente.length > 0) {
        return res.status(400).send('El deporte ya existe'); //arreglar aqui el manejo de errores
    }

    const nuevoDeporte = { nombre, precio };
    data.deportes.push(nuevoDeporte);
    console.log('ingresados: ', data.deportes);
    fs.writeFileSync('deportes.json', JSON.stringify(data));

    res.send('Deporte agregado con éxito')

});

// 2. Crear una ruta que al consultarse devuelva en formato JSON todos los deportes
// registrados (2 Puntos).

app.get('/deportes', (req, res) => {
    const data = leerJson();
    res.json(data);
});

// 3. Crear una ruta que edite el precio de un deporte registrado, utilizando los parámetros de la
// consulta y persista este cambio (2 Puntos). Recuerde que para modificar se debe consultar, por
// tanto, hay que validar 2 cosas primero que se reciba el parámetro y después que exista el
// deporte coincidente con el parámetro. Manejar esta ruta con queryStrings.

app.get('/editar', (req, res) => {
    const { nombre, precio } = req.query;

    const data = leerJson();

    //modificar
    let nuevoPrecio = data.deportes.map(deporte => { //el map crea otro arreglo
        if (deporte.nombre === nombre) {
            deporte.precio = precio;
        }
        return deporte
    });

    //persistencia
    fs.writeFileSync('deportes.json', JSON.stringify({ deportes: nuevoPrecio }));
    res.send('Deporte editado con éxito')

});

// 4. Crear una ruta que elimine un deporte solicitado desde el cliente y persista este cambio (3 Puntos). En
// el Backend Validar que se recibe el parámetro requerido, también validar después si existe el
// deporte solicitado y solo si existe se podrá eliminar. Manejar esta ruta utilizando parámetros no
// queryStrings, ojo, que esto requiere un pequeño cambio en el Front.

app.get('/eliminar/:nombre', (req, res) => {

    const nombreDeporte = req.params.nombre;

    const data = leerJson();

    // verificar que el deporte exista
    const deporteAEliminar = data.deportes.find(deporte => deporte.nombre === nombreDeporte);
    if (!deporteAEliminar) {
        return res.status(404).send('El deporte no existe');
    }

    const deportesExistentes = data.deportes.filter(deporte => deporte.nombre !== nombreDeporte);

    //persistencia
    fs.writeFileSync('deportes.json', JSON.stringify({ deportes: deportesExistentes }));
    res.send('Deporte eliminado con éxito')


});

//ruta no existente

app.get('*', (req,res) => {
    res.status(404).send('ruta inválida, pruebe con /deportes para listar deportes, y / para ir al home');
});