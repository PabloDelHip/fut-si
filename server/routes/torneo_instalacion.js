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
    const datos = saveTorneoInstalacion(body.torneo, body.instalacion, body.usuario);
    res.json({
        datos   
    })
    
});


//editar redes sociales
app.put('/torneos-instalaciones/torneo/:id_torneo/instalacion/:id_instalacion', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre']);
            
    TorneoInstalacion.findByIdAndUpdate(id, body, {new: true}, (err, tipo_torneoDB) => {
        
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
app.put('/torneos-instalaciones/torneo/:id', function (req, res) {
    let body = req.body;
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    let condiciones = {
        torneo: req.params.id,
        estado: true
    }
    TorneoInstalacion.updateMany(condiciones, cambiaEstado, {new: true}, (err, torneo_instalacionBorrado) => {

        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        activarTorneoInstalacion(body.torneo_instalaciones,id, body.id_usuario);

        res.json({
            ok:true,
            torneo_instalacion: torneo_instalacionBorrado
        })

    });
    
    // res.send('Delete usuarios')
});

function activarTorneoInstalacion(instalaciones,id_torneo, id_usuario)
{

    instalaciones.forEach(instalacion => {
        console.log(instalacion);
        let cambiaEstado = {
            estado: true
        }
        let condiciones = [{
            torneo: id_torneo,
            instalacion: instalacion._id,
            estado: false
        }];
    
        TorneoInstalacion.findOneAndUpdate({ $and: condiciones }, cambiaEstado, {new: true}, (err, torneo_instalacion) => {
    
            if(err)
            {
                console.log(err)
            }         
    
            if(torneo_instalacion == null){
                
                const datos = saveTorneoInstalacion(id_torneo, instalacion._id, id_usuario);
                
            }
        });
    });
}
function saveTorneoInstalacion(id_torneo, id_instalacion, id_usuario)
{
    let torneo_instalacion = new TorneoInstalacion({
        torneo: id_torneo,
        instalacion: id_instalacion,
        usuario: id_usuario
    });

    torneo_instalacion.save( (err, torneoInstalacionDB) => {
        
        if(err)
        {
            console.log( err);
            return [{
                ok: false,
                err
            }]
        }

        return [{
            ok:true,
            torneo_instalacion: torneoInstalacionDB
        }]

        

    });
}
module.exports = app;
