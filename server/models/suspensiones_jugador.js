const mongoose = require('mongoose'); //libreria para manejar mongo
let Schema = mongoose.Schema;


//se crea el modelo con los campos que tiene la base de datos
let Suspensiones_jugadorschema = new Schema({
    tarjeta_roja: {
        type: Boolean,
        default: false
    },
    motivo_suspension: {
        type: String,
    },
    num_partidos: {
        type: Number,
        require: [true,'El numero de partidos es Obligatoria']
    },
    partidos_restantes: {
        type: Number,
        require: [true,'El numero de partidos es obligatorio']
    },
    id_torneo: {
        type: String,
        require: [true,'El ID del torneo es obligatorio']
    },
    fecha_suspension: {
        type: String,
        lastActiveAt: Date, //Año-mes-dia
        require: [true,'La fecha de inicio de la suspension es obligatoria']
    },
    fecha_final_suspension:{// 1= gol, 2=autogol
        type: String,
        lastActiveAt: Date, //Año-mes-dia
    },
    estado:{
        type: Boolean,
        default: true
    }
});

//agregar ID formato del torneo

module.exports = mongoose.model('suspensiones_jugador',Suspensiones_jugadorschema, "suspensiones_jugadores");