const mongoose = require('mongoose'); //libreria para manejar mongo
let Schema = mongoose.Schema;


//se crea el modelo con los campos que tiene la base de datos
let Tablaschema = new Schema({
    jugados: {
        type: Number,
        default: 0
    },
    partidos_ganados: {
        type: Number,
        default: 0
    },
    partidos_empatados: {
        type: Number,
        default: 0
    },
    partidos_perdidos: {
        type: Number,
        require: 0
    },
    goles_favor: {
        type: Number,
        default: 0
    },
    goles_contra: {
        type: Number,
        default: 0
    },
    id_equipo:{
        type: String,
        required:[true, 'el ID del equipo es obligatorio']
    },
    id_torneo:{
        type: String,
        required:[true, 'el ID del torneo es obligatorio']
    },
    estado:{
        type: Boolean,
        default: true
    }
});

//agregar ID formato del torneo

module.exports = mongoose.model('tabla',Tablaschema, "tablas");