const mongoose = require('mongoose'); //libreria para manejar mongo
let Schema = mongoose.Schema;


//se crea el modelo con los campos que tiene la base de datos
let organizacionSchema = new Schema({
    titulo: {
        type: String,
        require: [true,'El titulo es Obligatorio']
    },
    estado_pais: {
        type: Schema.Types.ObjectId,
        ref:'Estado',
        require: [true,'El Estado es Obligatorio']
    },
    municipio: {
        type: Schema.Types.ObjectId,
        ref:'Municipio',
        require: [true,'El Municipio es Obligatorio']
    },
    tipo_moneda:{
        type: String,
        require: [true, 'El tipo de moneda es obligatorio'],
        default: 'MXN'
    },
    direccion:{
        type: String
    },
    codigo_postal:{
        type: String
    },
    telefono:{
        type: String,
        match: [/^[0-9]/, 'Por favor ingrese solo numeros para el telefono'], // <- Validación regexp para correo
        required:false
    },
    celular:{
        type: String,
        match: [/^[0-9]/, 'Por favor ingrese solo numeros para el telefono'],
    },
    email:{
        type: String,
        match: [/.+\@.+\..+/, 'Por favor ingrese un correo válido'],
        required:false
    },
    sitio_web:{
        type: String
    },
    notas:{
        type: String
    },
    estado:{
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref:'Usuario',
        require: [true,'El Usuario es Obligatorio']
    },

});


module.exports = mongoose.model('Organizacion',organizacionSchema, "organizaciones");