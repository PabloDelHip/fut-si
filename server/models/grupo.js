const mongoose = require('mongoose'); //libreria para manejar mongo
let Schema = mongoose.Schema;


//se crea el modelo con los campos que tiene la base de datos
let grupoSchema = new Schema({
    nombre: {
        type: String,
        require: [true,'El ID del jugador es Obligatorio']
    },
    equipos_clasifican: {
        type: Number,
        require: [true,'El numero de equipos es Obligatorio']
    },
    goles_default: {
        type: Number,
        require: [true,'Los goles por default es Obligatorio']
    },
    puntos_victoria: {
        type: Number,
        require: [true,'Los puntos por victoria son Obligatorios']
    },
    puntos_empate: {
        type: Number,
        require: [true,'Los puntos de empate son Obligatorios']
    },
    puntos_derrota: {
        type: Number,
        require: [true,'Los puntos por derrota son Obligatorios']
    },
    id_torneo: {
        type: String,
        require: [true,'El ID del torneo es Obligatorios']
    },
    estado:{
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('grupo',grupoSchema, "grupoSchema");