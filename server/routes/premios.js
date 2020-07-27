const express = require('express');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const Premios = require('../models/premios');


const app = express();

//retornar todas las organizaciones
//BIEN//
app.get('/premio', function (req, res) {


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);
    Premios.find({estado: true},'mejor_portero goleador id_equipo id_torneo id_jugador goles estado')
            .skip(desde)
            .limit(limite)
            .exec( (err,premio) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok:true,
                    premio
                });
            });

  });

//retornar todas las redes sociales filtradas por el ID del usuario
//BIEN
app.get('/premio/:id', function (req, res) {

    let condiciones = {
        _id: req.params.id,
        estado: true
    }

    Premios.find(condiciones,'mejor_portero goleador id_equipo id_torneo id_jugador goles estado')
            .exec( (err,premio) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(premio.length === 0)
                {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Premio no encontrado'
                        }
                    });
                }

                res.json({
                    ok:true,
                    premio,
                });
            });

  });



//guardar datos
//BIEN
app.post('/premio', function (req, res) {

    let body = req.body;
    let premio = new Premios({
        mejor_portero: body.mejor_portero,
        goleador: body.goleador,
        id_equipo: body.id_equipo,
        id_torneo: body.id_torneo,
        id_jugador: body.id_jugador,
        goles: body.goles
    });

    premio.save( (err, premioDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            record_limpio: premioDB
        })

    });
    
});


//editar redes sociales
app.put('/premio/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['mejor_portero', 'goleador', 'id_equipo', 'id_torneo', 'id_jugador', 'goles']);
            
    Premio.findByIdAndUpdate(id, body, {new: true}, (err, premioDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            premio: premioDB
        });
    }) 
});

//eliminar organizacion
app.delete('/premio/:id', function (req, res) {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    Premio.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, premioBorrado) => {

        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(premioBorrado.length === 0)
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
            premio: premioBorrado
        })

    });
    
    // res.send('Delete usuarios')
});

module.exports = app;
