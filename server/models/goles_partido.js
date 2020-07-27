const mongoose = require('mongoose'); //libreria para manejar mongo
let Schema = mongoose.Schema;


//se crea el modelo con los campos que tiene la base de datos
let golesPartidoSchema = new Schema({
    id_jugador: {
        type: String,
        require: [true,'El ID del jugador es Obligatorio']
    },
    id_partido: {
        type: String,
        require: [true,'El ID del partido es Obligatorio']
    },
    minuto: {
        type: Number,
        require: [true,'El minuto del gol es Obligatorio']
    },
    fecha: {
        type: String,
        lastActiveAt: Date, //Año-mes-dia
        require: [true,'La fecha es obligatoria']
    },
    tipo_gol:{// 1= gol, 2=autogol
        type: Number,
        require: [true, 'El tipo de gol es obligatorio'],  
    },
    estado:{
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('golesPartido',golesPartidoSchema, "goles_partidos");