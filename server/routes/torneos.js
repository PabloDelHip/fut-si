const express = require('express');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const Torneo = require('../models/torneos');


const app = express();

//retornar todas las organizaciones
//BIEN//
app.get('/torneos', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);
    Torneo.find({estado: true},'nombre descripcion duracion_tiempo sexo_jugadores fecha_inicio fecha_final_temporada fecha_limite_pagos costo_inscripcion costo_albitraje notas lunes martes miercoles jueves viernes sabado domingo estado')
            .skip(desde)
            .limit(limite)
            .exec( (err,torneo) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                
                Torneo.count({ estado: true }, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        torneo,
                        
                    });

                });
            });

  });

//retornar todas las redes sociales filtradas por el ID del usuario
//BIEN
app.get('/torneos/:id', function (req, res) {

    let condiciones = {
        _id: req.params.id,
        estado: true
    }

    Torneo.find(condiciones,'nombre duracion_tiempo sexo_jugadores fecha_inicio fecha_final_temporada fecha_limite_pagos costo_inscripcion costo_albitraje notas lunes martes miercoles jueves viernes sabado domingo categoria tipo_torneo')
            .exec( (err,torneo) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(torneo.length === 0)
                {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Torneo no encontrado'
                        }
                    });
                }

                Torneo.count(condiciones, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        torneo,
                        
                    });

                });
            });

  });

  app.get('/torneos/usuario/:id', function (req, res) {

    let condiciones = {
        usuario: req.params.id,
        estado: true
    }

    Torneo.find(condiciones,'nombre activo')
            .exec( (err,torneo) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(torneo.length === 0)
                {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Torneo no encontrado'
                        }
                    });
                }

                Torneo.count(condiciones, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        torneo,
                        
                    });

                });
            });

  });

//guardar datos
//BIEN
app.post('/torneos', function (req, res) {

    let body = req.body;
    let torneos = new Torneo({
        nombre: body.nombre,
        duracion_tiempo: body.duracion_tiempo,
        sexo_jugadores: body.sexo_jugadores,
        fecha_inicio: body.fecha_inicio,
        fecha_final_temporada: body.fecha_final_temporada,
        fecha_limite_pagos: body.fecha_limite_pagos,
        costo_inscripcion: body.costo_inscripcion,
        costo_albitraje: body.costo_albitraje,
        notas: body.notas,
        lunes: body.lunes,
        martes: body.martes,
        miercoles: body.miercoles,
        jueves: body.jueves,
        viernes: body.viernes,
        sabado: body.sabado,
        domingo: body.domingo,
        instalacion: body.instalacion,
        categoria: body.categoria,
        tipo_torneo: body.tipo_torneo,
        modo_juego: body.modo_juego,
        campeon: body.campeon,
        num_equipos: body.num_equipos,
        vueltas_torneo: body.vueltas_torneo,
        vueltas_eliminacion: body.vueltas_eliminacion,
        vueltas_final: body.vueltas_final,
        usuario: body.usuario
    });


    torneos.save( (err, torneosDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            torneo: torneosDB
        })

    });
    
});



app.put('/torneos/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'descripcion', 'duracion_tiempo', 'sexo_jugadores', 'fecha_inicio', 'fecha_final_temporada', 'fecha_limite_pagos', 'costo_inscripcion', 'costo_albitraje', 'notas', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']);
            
    Torneo.findByIdAndUpdate(id, body, {new: true}, (err, torneoDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            torneo: torneoDB
        });
    }) 
});

//eliminar organizacion
app.delete('/torneos/:id', function (req, res) {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    Torneo.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, torneoBorrado) => {

        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(torneoBorrado.length === 0)
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Torneo no encontrada'
                }
            });
        }

        res.json({
            ok:true,
            torneo: torneoBorrado
        })

    });
    
    // res.send('Delete usuarios')
});

module.exports = app;
