const mongoose = require('mongoose'); //libreria para manejar mongo
let Schema = mongoose.Schema;

//se crea el modelo con los campos que tiene la base de datos
let recordLimpioSchema = new Schema({
    id_partido: {
        type: String,
        required:[true, 'el ID del partido es obligatorio']
    },
    id_jugador:{
        type: String,
        required:[true, 'el ID del jugador es obligatorio']
    },
    estado:{
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('record_limpio',recordLimpioSchema, "record_limpios");


