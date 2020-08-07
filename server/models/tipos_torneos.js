const mongoose = require('mongoose'); //libreria para manejar mongo
let Schema = mongoose.Schema;


//se crea el modelo con los campos que tiene la base de datos
let TiposTorneosSchema = new Schema({
    nombre: {
        type: String,
        require: [true,'El nombre de la categoria es Obligatorio']
    },
    estado:{
        type: Boolean,
        default: true
    },
});

module.exports = mongoose.model('Tipo_Torneo',TiposTorneosSchema, "tipos_torneos");