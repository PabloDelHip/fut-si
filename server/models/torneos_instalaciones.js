const mongoose = require('mongoose'); //libreria para manejar mongo
const uniqueValidator = require('mongoose-unique-validator'); //libreria para validar y crear errores

let Schema = mongoose.Schema;


//se crea el modelo con los campos que tiene la base de datos
let torneosInstalacionesSchema = new Schema({
    torneo: {
        type: Schema.Types.ObjectId,
        ref:'Torneo',
        required: [true,'El id torneo es Obligatorio']
    },
    instalacion: {
        type: Schema.Types.ObjectId,
        ref:'Instalacion',
        required: [true,'El id instalacion es Obligatorio']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref:'Usuario',
        required: [true,'El usuario es Obligatorio']
    },
    estado:{
        type: Boolean,
        default: true
    },
});


module.exports = mongoose.model('TorneosInstalaciones',torneosInstalacionesSchema, "torneos_instalaciones");