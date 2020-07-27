const mongoose = require('mongoose'); //libreria para manejar mongo
let Schema = mongoose.Schema;


//se crea el modelo con los campos que tiene la base de datos
let ImagenesInstalacionesSchema = new Schema({
    nombre: {
        type: String,
        require: [true,'El nombre de la imagen es obligatorio']
    },
    instalacion: { type: Schema.Types.ObjectId, ref:'Instalacion'},
    estado:{
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('ImagenInstalaciones',ImagenesInstalacionesSchema, "imagenes_instalaciones");