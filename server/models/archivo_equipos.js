const mongoose = require('mongoose'); //libreria para manejar mongo
let Schema = mongoose.Schema;


//se crea el modelo con los campos que tiene la base de datos
let ArchivoEquiposSchema = new Schema({
    nombre: {
        type: String,
        require: [true,'El nombre del documento es obligatorio']
    },
    archivo: {
        type: String,
        require: [true,'El archivo es obligatorio']
    },
    id_equipo: {
        type: String,
        require: [true,'El ID del equipo es Obligatorio']
    },
    estado:{
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('archivo_equipo',ArchivoEquiposSchema, "archivo_equipos");