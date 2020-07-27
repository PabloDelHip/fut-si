const mongoose = require('mongoose'); //libreria para manejar mongo
let Schema = mongoose.Schema;


//se crea el modelo con los campos que tiene la base de datos
let equipoSchema = new Schema({
    nombre: {
        type: String,
        require: [true,'El Nombre es Obligatorio']
    },
    dia_favorito: {
        type: String
    },
    horario_favorito: {
        type: Number
    },
    id_usuario: {
        type: String,
        require: [true,'El ID de usuario es obligatoria']
    },
    uniforme_local:{
        type: String,
        default: false
    },
    uniforme_visita:{
        type: String,
        default: false
    },
    logo:{
        type: String,
        default: false
    },
    foto_equipo:{
        type: String,
        default: false
    },
    archivos_completos:{
        type: Boolean,
        default: false
    },
    estado:{
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('equipo',equipoSchema, "equipos");