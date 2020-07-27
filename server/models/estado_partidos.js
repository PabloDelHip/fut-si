const mongoose = require('mongoose'); //libreria para manejar mongo
const uniqueValidator = require('mongoose-unique-validator'); //libreria para validar y crear errores

let Schema = mongoose.Schema;


//se crea el modelo con los campos que tiene la base de datos
let EstadoPartidoschema = new Schema({
    nombre: {
        type: String,
        require: [true,'Ingresar el nombre del estado es obligatorio'],
        unique: true
    },
    estado:{
        type: Boolean,
        default: true
    } 
});
     
//agregar ID formato del torneo
EstadoPartidoschema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});

module.exports = mongoose.model('estado_partidos',EstadoPartidoschema, "estados_partidos");