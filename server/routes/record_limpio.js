const express = require('express');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const recordLimpio = require('../models/record_limpio');


const app = express();

//retornar todas las organizaciones
//BIEN//
app.get('/record-limpio', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);
    recordLimpio.find({estado: true},'id_partido id_jugador estado')
            .skip(desde)
            .limit(limite)
            .exec( (err,record_limpio) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok:true,
                    record_limpio
                });
            });

  });

//retornar todas las redes sociales filtradas por el ID del usuario
//BIEN
app.get('/record-limpio/:id', function (req, res) {

    let condiciones = {
        _id: req.params.id,
        estado: true
    }

    recordLimpio.find(condiciones,'id_partido id_jugador estado')
            .exec( (err,record_limpio) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(record_limpio.length === 0)
                {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Record limpio no encontrado'
                        }
                    });
                }

                res.json({
                    ok:true,
                    record_limpio,
                });
            });

  });

  app.get('/record-limpio/jugador/:id', function (req, res) {

    let condiciones = {
        id_jugador: req.params.id,
        estado: true
    }

    recordLimpio.find(condiciones,'id_partido id_jugador estado')
            .exec( (err,record_limpio) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(record_limpio.length === 0)
                {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Record limpio no encontrado'
                        }
                    });
                }

                res.json({
                    ok:true,
                    record_limpio,
                });
            });

  });


//guardar datos
//BIEN
app.post('/record-limpio', function (req, res) {

    let body = req.body;
    let record_limpio = new recordLimpio({
        id_partido: body.id_partido,
        id_jugador: body.id_jugador
    });

    record_limpio.save( (err, record_limpioDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            record_limpio: record_limpioDB
        })

    });
    
});


//editar redes sociales
app.put('/record-limpio/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['id_partido', 'id_jugador', 'estado']);
            
    recordLimpio.findByIdAndUpdate(id, body, {new: true}, (err, record_limpioDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            record_limpio: record_limpioDB
        });
    }) 
});

//eliminar organizacion
app.delete('/record-limpio/:id', function (req, res) {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    recordLimpio.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, record_limpioBorrado) => {

        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(record_limpioBorrado.length === 0)
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Record Limpio no encontrado'
                }
            });
        }

        res.json({
            ok:true,
            record_limpio: record_limpioBorrado
        })

    });
    
    // res.send('Delete usuarios')
});

module.exports = app;
