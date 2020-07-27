const mongoose = require('mongoose'); //libreria para manejar mongo

const uniqueValidator = require('mongoose-unique-validator'); //libreria para validar y crear errores

let Schema = mongoose.Schema;


//se crea el modelo con los campos que tiene la base de datos
let municipioSchema = new Schema({
    nombre: {
        type: String,
        require: [true,'El nombre es Obligatorio'],
    },
    estado: { type: Schema.Types.ObjectId, ref:'Estado'}

});

module.exports = mongoose.model('Municipio',municipioSchema,"municipio");