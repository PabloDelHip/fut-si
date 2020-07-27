const mongoose = require('mongoose'); //libreria para manejar mongo

const uniqueValidator = require('mongoose-unique-validator'); //libreria para validar y crear errores

let Schema = mongoose.Schema;


//Usuario Tipo 1 admin
//Usuario 2 arbitro

//se crea el modelo con los campos que tiene la base de datos
let jugadorSchema = new Schema({
    nombre: {
        type: String,
        require: [true,'El nombre es Obligatorio']
    },
    apellidos: {
        type: String,
        require: [true,'El Apellido es Obligatorio']
    },
    fecha_nacimiento: {
        type: String,
        lastActiveAt: Date
    },
    sexo:{
        type: String,
        required:[true, 'El sexo es obligatorio']
    },
    direccion:{
        type: String,
        required:false
    },
    codigo_postal:{
        type: String,
        required:false
    },
    estatura:{
        type: Number,
        required:false
    },
    peso:{
        type: String,
        require: false
    },
    email:{
        type: String,
        match: [/.+\@.+\..+/, 'Por favor ingrese un correo válido'],
        unique: true,
        required:false
    },
    telefono:{
        type: String,
        match: [/^[0-9]/, 'Por favor ingrese solo numeros para el telefono'],
    },
    celular:{
        type: String,
        match: [/^[0-9]/, 'Por favor ingrese solo numeros para el telefono'],
    },
    numero_preferido:{
        type: String,
        match: [/^[0-9]/, 'Por favor ingrese solo numeros para el telefono'],
    },
    goles:{
        type: Number,
        match: [/^[0-9]/, 'Por favor ingrese solo numeros para los goles'],
        default: 0
    },
    partidos_jugados:{
        type: Number,
        match: [/^[0-9]/, 'Por favor ingrese solo numeros para los partidos jugados'],
        default: 0
    },
    id_nacionalidad:{
        type: String,
        required:[true, 'La nacionalidad es obligatoria']
    },
    id_ciudad:{
        type: String,
        required:[true, 'La ciudad es obligatoria']
    },
    estado:{
        type: Boolean,
        default: true
    }

});

//lleva tablas intermedias

jugadorSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});

module.exports = mongoose.model('Jugador',jugadorSchema, "jugadores");