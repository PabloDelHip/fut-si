const mongoose = require('mongoose'); //libreria para manejar mongo
let Schema = mongoose.Schema;


//se crea el modelo con los campos que tiene la base de datos
let Partidoschema = new Schema({
    jornada: {
        type: Number,
        require: [true,'Ingresar el numero de jornada es obligatorio']
    },
    id_grupo: {
        type: String
    },
    id_equipo_uno: {
        type: String,
        require: [true,'El id del equipo 1 es obligatorio']
    },
    id_equipo_dos: {
        type: String,
        require: [true,'El id del equipo 2 obligatorio']
    },
    goles_equipo_uno: {
        type: Number,
        require: [true,'Los goles del equipo numero uno es obligatorio']
    },
    goles_equipo_dos: {
        type: Number,
        require: [true,'Los goles del equipo numero dos es obligatorio']
    },
    id_estado_partido:{// 1= gol, 2=autogol
        type: String,
        require: [true,'El estado del partido es obligatorio']
    },
    nota_albitro:{// 1= gol, 2=autogol
        type: String
    },
    notas_albitro_imagen:{// 1= gol, 2=autogol
        type: String
    },
    notas:{// 1= gol, 2=autogol
        type: String
    },
    notas_imagen:{// 1= gol, 2=autogol
        type: String
    },
    fecha: {
        type: String,
        lastActiveAt: Date, //Año-mes-dia
        require: [true,'La fecha del partido es obligatoria']
    },
    hora:{
        type: String,
        require: [true,'La hora del partido es obligatoria']
    },
    id_arbitro:{
        type: String,
        default: false
    },
    estado:{
        type: Boolean,
        default: true
    }
});

//agregar ID formato del torneo

module.exports = mongoose.model('partido',Partidoschema, "partidos");