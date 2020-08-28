const express = require('express');
var cors = require('cors');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const TorneoInstalacion = require('../models/torneos_instalaciones');
const Torneo = require('../models/torneos');
const Instalacion = require('../models/instalaciones');

const app = express();
app.use(cors())

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }


app.get('/torneos-instalaciones/torneo/:id', function (req, res) {

    console.log(req.params.id);
    let condiciones = {
        torneo: req.params.id,
        estado: true
    }
    

    TorneoInstalacion.find(condiciones)
            .populate('torneo')
            .populate('instalacion')
            .exec( (err,torneo_instalacion) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(torneo_instalacion.length === 0)
                {
                    console.log(torneo);
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Torneo no encontrado'
                        }
                    });
                }

                res.json({
                    ok:true,
                    torneo_instalacion,
                    
                });


                // Instalacion.populate(torneo, {path: "instalacion"},function(err, instalaciones){
                //     res.json({
                //         ok:true,
                //         instalaciones,
                        
                //     });
                // });

            });

  });


//guardar datos
//BIEN
app.post('/torneos-instalaciones', function (req, res) {

    let body = req.body;


    let torneo_instalacion = new TorneoInstalacion({
        torneo: body.torneo,
        instalacion: body.instalacion,
        usuario: body.usuario
    });

    torneo_instalacion.save( (err, torneoInstalacionDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            torneo_instalacion: torneoInstalacionDB
        })

    });
    
});


//editar redes sociales
app.put('/tipo-torneo/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre']);
            
    tipoTorneo.findByIdAndUpdate(id, body, {new: true}, (err, tipo_torneoDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            tipo_torneo: tipo_torneoDB
        });
    }) 
});

//eliminar organizacion
app.delete('/categoria/:id', function (req, res) {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    tipoTorneo.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, tipo_torneoBorrado) => {

        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(tipo_torneoBorrado.length === 0)
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Tipo Torneo no encontrado'
                }
            });
        }

        res.json({
            ok:true,
            tipo_torneo: tipo_torneoBorrado
        })

    });
    
    // res.send('Delete usuarios')
});

module.exports = app;
