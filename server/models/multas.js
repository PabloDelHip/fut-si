const mongoose = require('mongoose'); //libreria para manejar mongo
const uniqueValidator = require('mongoose-unique-validator'); //libreria para validar y crear errores

let Schema = mongoose.Schema;


//se crea el modelo con los campos que tiene la base de datos
let multaSchema = new Schema({
    titulo: {
        type: String,
        require: [true,'El titulo es Obligatorio']
    },
    precio: {
        type: String,
        require: [true,'El precio es Obligatorio']
    },
    puntos_por_cumplir:{
        type: Number
    },
    puntos_penalizacion:{
        type: Number
    },
    goles_penalización: {
        type: Number
    },
    estado:{
        type: Boolean,
        default: true
    }

});

module.exports = mongoose.model('multa',organizacionSchema, "multas");