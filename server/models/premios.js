const mongoose = require('mongoose'); //libreria para manejar mongo
let Schema = mongoose.Schema;

//se crea el modelo con los campos que tiene la base de datos
let PremiosSchema = new Schema({
    mejor_portero:{
        type: Boolean,
        default: false
    },
    goleador: {
        type: Boolean,
        default: true
    },
    id_equipo:{
        type: String,
        required:[true, 'el ID del equipo es obligatorio']
    },
    id_torneo:{
        type: String,
        required:[true, 'el ID del equipo es obligatorio']
    },
    id_jugador:{
        type: String,
        required:[true, 'el ID del equipo es obligatorio']
    },
    goles:{
        type: Number,
        required:[true, 'Los goles son obligatorios']
    },
    estado:{
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('premios',PremiosSchema, "premios");


