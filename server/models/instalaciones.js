const mongoose = require('mongoose'); //libreria para manejar mongo
const uniqueValidator = require('mongoose-unique-validator'); //libreria para validar y crear errores

let Schema = mongoose.Schema;


//se crea el modelo con los campos que tiene la base de datos
let instalacionSchema = new Schema({
    nombre: {
        type: String,
        required: [true,'El nombre es Obligatorio']
    },
    estado_pais: {
        type: Schema.Types.ObjectId,
        ref:'Estado',
        required: [true,'El estado es Obligatorio']
    },
    municipio: {
        type: Schema.Types.ObjectId,
        ref:'Municipio',
        required: [true,'La ciudad es Obligatorio']
    },
    direccion:{
        type: String,
        required: [true, 'La direccion es obligatoria']
    },
    codigo_postal: {
        type: String
    },
    telefono:{
        type: String,
        match: [/^[0-9]/, 'Por favor ingrese solo numeros para el telefono'],
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
    latitud_map:{
        type: String,
    },
    longitud_map:{
        type: String,
    },
    vestuarios:{
        type: Boolean,
        default: false
    },
    camisetas:{
        type: Boolean,
        default: false
    },
    estacionamiento:{
        type: Boolean,
        default: false
    },
    cafeteria:{
        type: Boolean,
        default: false
    },
    restaurante:{
        type: Boolean,
        default: false
    },
    tiendas:{
        type: Boolean,
        default: false
    },
    notas:{
        type: String,
    },
    estado:{
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref:'Usuario',
        required: [true,'El usuario es Obligatorio']
    },
});

instalacionSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});

module.exports = mongoose.model('Instalacion',instalacionSchema, "instalaciones");