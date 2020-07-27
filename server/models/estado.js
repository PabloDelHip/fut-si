const mongoose = require('mongoose'); //libreria para manejar mongo

const uniqueValidator = require('mongoose-unique-validator'); //libreria para validar y crear errores

let Schema = mongoose.Schema;


//se crea el modelo con los campos que tiene la base de datos
let estadoSchema = new Schema({
    nombre: {
        type: String,
        require: [true,'El nombre es Obligatorio'],
        unique: true
    }

});
estadoSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});

module.exports = mongoose.model('Estado',estadoSchema,"estado");