const mongoose = require('mongoose'); //libreria para manejar mongo

const uniqueValidator = require('mongoose-unique-validator'); //libreria para validar y crear errores

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

//Usuario Tipo 1 admin
//Usuario 2 arbitro

//se crea el modelo con los campos que tiene la base de datos
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        require: [true,'El nombre es Obligatorio']
    },
    apellidos: {
        type: String,
        require: [true,'El Apellido es Obligatorio']
    },
    email:{
        type: String,
        unique: true,
        require: [true, 'El correo es obligatorio']
    },
    password: {
        type: String,
        required:[true, 'La contraseña es obligatoria']
    },
    sexo:{
        type: String,
        required:[true, 'El sexo es obligatorio']
    },
    fecha_nacimiento:{
        type: String,
        required:[true, 'La fecha de nacimiento es obligatoria']
    },
    sitio_web:{
        type: String,
        required:false
    },
    telefono:{
        type: String,
        required:false
    },
    celular:{
        type: String,
        required:false
    },
    foto:{
        type: String,
        require: false
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default: true
    }

});

usuarioSchema.methods.toJSON = function()
{
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});

module.exports = mongoose.model('Usuario',usuarioSchema);