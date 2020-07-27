const express = require('express');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const SuspensionesJugador = require('../models/suspensiones_jugador');


const app = express();

//retornar todas las organizaciones
//BIEN//
app.get('/suspensiones-jugador', function (req, res) {

    
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);
    SuspensionesJugador.find({estado: true},'tarjeta_roja motivo_suspension num_partidos partidos_restantes id_torneo fecha_suspension fecha_final_suspension estado')
            .skip(desde)
            .limit(limite)
            .exec( (err,suspensiones_jugador) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                
                SuspensionesJugador.count({ estado: true }, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        suspensiones_jugador,
                        
                    });

                });
            });

  });

//retornar todas las redes sociales filtradas por el ID del usuario
//BIEN
app.get('/suspensiones-jugador/:id', function (req, res) {

    let condiciones = {
        _id: req.params.id,
        estado: true
    }

    SuspensionesJugador.find(condiciones,'tarjeta_roja motivo_suspension num_partidos partidos_restantes id_torneo fecha_suspension fecha_final_suspension estado')
            .exec( (err,suspensiones_jugador) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(suspensiones_jugador.length === 0)
                {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Suspensiones Jugador no encontrado'
                        }
                    });
                }

                SuspensionesJugador.count(condiciones, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        suspensiones_jugador,
                        
                    });

                });
            });

  });

//guardar datos
//BIEN
app.post('/suspensiones-jugador', function (req, res) {

    let body = req.body;
    let suspension_jugadores = new SuspensionesJugador({
        tarjeta_roja: body.tarjeta_roja,
        motivo_suspension: body.motivo_suspension,
        num_partidos: body.num_partidos,
        partidos_restantes: body.partidos_restantes,
        id_torneo: body.id_torneo,
        fecha_suspension: body.fecha_suspension,
        fecha_final_suspension: body.fecha_final_suspension
    });


    suspension_jugadores.save( (err, suspension_jugadoresDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            torneo: suspension_jugadoresDB
        })

    });
    
});



app.put('/suspensiones-jugador/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['tarjeta_roja', 'motivo_suspension', 'num_partidos', 'partidos_restantes', 'id_torneo', 'fecha_suspension', 'fecha_final_suspension']);
            
    SuspensionesJugador.findByIdAndUpdate(id, body, {new: true}, (err, suspensiones_jugadorDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            suspensiones_jugador: suspensiones_jugadorDB
        });
    }) 
});

//eliminar organizacion
app.delete('/suspensiones-jugador/:id', function (req, res) {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    SuspensionesJugador.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, suspensiones_jugadorBorrado) => {

        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(suspensiones_jugadorBorrado.length === 0)
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Suspensiones jugador no encontrada'
                }
            });
        }

        res.json({
            ok:true,
            suspensiones_jugador: suspensiones_jugadorBorrado
        })

    });
    
    // res.send('Delete usuarios')
});

module.exports = app;
