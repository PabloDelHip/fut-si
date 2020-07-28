const mongoose = require('mongoose'); //libreria para manejar mongo
let Schema = mongoose.Schema;


//se crea el modelo con los campos que tiene la base de datos
let CategoriaSchema = new Schema({
    titulo: {
        type: String,
        require: [true,'El titulo de la categoria es Obligatorio']
    },
    edad_minima: {
        type: Number
    },
    edad_maxima: {
        type: Number
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

module.exports = mongoose.model('categoria',CategoriaSchema, "categorias");