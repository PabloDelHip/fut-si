const mongoose = require('mongoose'); //libreria para manejar mongo

const uniqueValidator = require('mongoose-unique-validator'); //libreria para validar y crear errores

let Schema = mongoose.Schema;

//se crea el modelo con los campos que tiene la base de datos
let usuarioSchema = new Schema({
    facebook: {
        type: String
    },
    twitter: {
        type: String
    },
    google_plus:{
        type: String
    },
    instagram: {
        type: String
    },
    youtube:{
        type: String
    },
    vimeo:{
        type: String
    },
    pinterest:{
        type: String
    },
    linkedin:{
        type: String
    },
    flickr:{
        type: String
    },
    usuario_id:{
        type: String,
        required:[true, 'el ID del usuario es obligatorio']
    },
    

});

module.exports = mongoose.model('RedesSociales',usuarioSchema);

