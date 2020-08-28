const mongoose = require('mongoose'); //libreria para manejar mongo
const uniqueValidator = require('mongoose-unique-validator'); //libreria para validar y crear errores

let Schema = mongoose.Schema;


//se crea el modelo con los campos que tiene la base de datos
let ModosJuegoSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        require: [true,'El nombre del modo de juego es Obligatorio']
    },
    descripcion: {
        type: String,
        unique: true,
        require: [true,'La descripcion del modo de juego es Obligatorio']
    },
    estado:{
        type: Boolean,
        default: true
    },
});

ModosJuegoSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});
module.exports = mongoose.model('Modo_juego',ModosJuegoSchema, "modos_juego");