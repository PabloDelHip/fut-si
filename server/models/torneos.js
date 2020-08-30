const mongoose = require('mongoose'); //libreria para manejar mongo
let Schema = mongoose.Schema;


//se crea el modelo con los campos que tiene la base de datos
let Torneoschema = new Schema({
    nombre: {
        type: String,
        require: [true,'El nombre del torneo Obligatorio']
    },
    duracion_tiempo: {
        type: String,
        require: [true,'La duración de cada tiempo del partido es obligatorio']
    },
    sexo_jugadores: {
        type: String,
        require: [true,'El sexo es obligatorio']
    },
    fecha_inicio: {
        type: String,
        lastActiveAt: Date, //Año-mes-dia
        require: [true,'La fecha de inicio del torneo es obligatoria']
    },
    fecha_final_temporada:{// 1= gol, 2=autogol
        type: String,
        lastActiveAt: Date, //Año-mes-dia
    },
    fecha_limite_pagos:{// 1= gol, 2=autogol
        type: String,
        lastActiveAt: Date, //Año-mes-dia
    },
    costo_inscripcion:{// 1= gol, 2=autogol
        type: Number,
        require: [true,'El costo de inscripción es obligatorio, si no tienen costo ingresa el numero 0']
    },
    costo_albitraje:{// 1= gol, 2=autogol
        type: Number,
        require: [true,'El costo del albitraje es obligatorio, si no tienen costo ingresa el numero 0']
    },
    notas:{// 1= gol, 2=autogol
        type: String
    },
    lunes:{
        type: Boolean,
        default: false
    },
    martes:{
        type: Boolean,
        default: false
    },
    miercoles:{
        type: Boolean,
        default: false
    },
    jueves:{
        type: Boolean,
        default: false
    },
    viernes:{
        type: Boolean,
        default: false
    },
    sabado:{
        type: Boolean,
        default: false
    },
    domingo:{
        type: Boolean,
        default: false
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref:'Categoria',
        required: [true,'La instalación es Obligatorio']
    },
    tipo_torneo: {
        type: Schema.Types.ObjectId,
        ref:'Tipo_Torneo',
        required: [true,'El tipo de torneo Obligatorio']
    },
    modo_juego: {
        type: Schema.Types.ObjectId,
        ref:'Modo_juego',
    },
    campeon: {
        type: String, //1: primer lugar campeon, 2:liguilla, 3: eliminacion directa
    },
    equipos_clasifican_final: {
        type: Number,
    },
    vueltas_torneo: {
        type: Number,
    },
    vueltas_eliminacion: {
        type: Number,
    },
    vueltas_final: {
        type: Number,
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
    activo:{
        type: Boolean,
        default: true
    }
});

// liguilla/primer lugar campeon/eliminacion directa
// num equipos clasifican
//vueltas partidos


//agregar ID formato del torneo

module.exports = mongoose.model('Torneo',Torneoschema, "torneos");