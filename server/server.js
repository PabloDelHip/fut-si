require('./config/config');

var path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const app = express();

var dir = path.join(__dirname, '../public');
console.log(dir);
app.use('/public',express.static(dir));

//const directory: string = path.join(__dirname, '/uploads');
//app.use('/uploads', express.static(directory));

//body parser es una libreria para poder obtener los datos que llegan mediante post
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
 
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));
app.use(require('./routes/redes_sociales'));
app.use(require('./routes/organizacion'));
app.use(require('./routes/goles_partido'));
app.use(require('./routes/instalaciones'));
app.use(require('./routes/categoria'));
app.use(require('./routes/torneos'));
app.use(require('./routes/estado_partidos'));
app.use(require('./routes/record_limpio'));
app.use(require('./routes/jugadores'));
app.use(require('./routes/premios'));
app.use(require('./routes/partidos'));
app.use(require('./routes/suspensiones_jugador'));
app.use(require('./routes/grupo'));
app.use(require('./routes/tabla'));
app.use(require('./routes/login'));
app.use(require('./routes/ciudades'));
app.use(require('./routes/imagen_instalaciones'));
//app.use(require('./routes/logino'));

// app.use(require('./routes/login'));

//nos conectramos a la base de datos de mongo con una libreria llamada mongoose
//la url es nuestra url de la base de datos al igual la ip
// mongoose.connect('mongodb://localhost:27017/fut-si', (err,res) =>{
    
//     if(err) throw err;
//     console.log("Base de datos ONLINES");

// });

mongoose.connect('mongodb://localhost:27017/fut_si', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, (err,res) =>{
    if(err) throw err;
    console.log("Base de datos ONLINES");
});


app.listen(process.env.PORT, () => {
    console.log("escuchando puerto", process.env.PORT);
});