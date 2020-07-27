const express = require('express');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const estadoPartidos = require('../models/estado_partidos');


const app = express();

//retornar todas las organizaciones
//BIEN//
app.get('/estado-partidos', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);
    estadoPartidos.find({estado: true},'nombre')
            .skip(desde)
            .limit(limite)
            .exec( (err,estado_partido) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                estadoPartidos.count({ estado: true }, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        estado_partido,
                        
                    });

                });
            });

  });

//retornar todas las redes sociales filtradas por el ID del usuario
//BIEN
app.get('/estado-partidos/:id', function (req, res) {

    let condiciones = {
        _id: req.params.id,
        estado: true
    }

    estadoPartidos.find(condiciones,'nombre estado')
            .exec( (err,estado_partido) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(estado_partido.length === 0)
                {
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'Estado de partido no encontrada'
                        }
                    });
                }

                estadoPartidos.count(condiciones, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        estado_partido,
                        
                    });

                });
            });

  });

//guardar datos
//BIEN
app.post('/estado_partidos', function (req, res) {

    let body = req.body;
    let estado_partidos = new estadoPartidos({
        nombre: body.nombre
    });

    estado_partidos.save( (err, estado_partidoDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            estado_partido: estado_partidoDB
        })

    });
    
});


//editar redes sociales
app.put('/estado-partidos/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre']);
            
    estadoPartidos.findByIdAndUpdate(id, body, {new: true}, (err, estado_partidoDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            estado_partido: estado_partidoDB
        });
    }) 
});

//eliminar organizacion
app.delete('/estado-partidos/:id', function (req, res) {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    estadoPartidos.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, estado_partidoBorrado) => {

        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(estado_partidoBorrado.length === 0)
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Estado de partido no encontrado'
                }
            });
        }

        res.json({
            ok:true,
            estado_partido: estado_partidoBorrado
        })

    });
    
    // res.send('Delete usuarios')
});

module.exports = app;
