const express = require('express');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const Grupo = require('../models/grupo');


const app = express();

//retornar todas las organizaciones
//BIEN//
app.get('/grupo', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);
    Grupo.find({estado: true},'nombre equipos_clasifican goles_default puntos_victoria puntos_empate puntos_derrota id_torneo')
            .skip(desde)
            .limit(limite)
            .exec( (err,grupo) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok:true,
                    grupo
                });
            });

  });

//retornar todas las redes sociales filtradas por el ID del usuario
//BIEN
app.get('/grupo/:id', function (req, res) {

    let condiciones = {
        _id: req.params.id,
        estado: true
    }

    Grupo.find(condiciones,'nombre equipos_clasifican goles_default puntos_victoria puntos_empate puntos_derrota id_torneo')
            .exec( (err,grupos) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(grupos.length === 0)
                {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Grupo no encontrado'
                        }
                    });
                }

                res.json({
                    ok:true,
                    grupos,
                });
            });

  });

//guardar datos
//BIEN
app.post('/grupo', function (req, res) {

    let body = req.body;
    let grupo = new Grupo({
        nombre: body.nombre,
        equipos_clasifican: body.equipos_clasifican,
        goles_default: body.goles_default,
        puntos_victoria: body.puntos_victoria,
        puntos_empate: body.puntos_empate,
        puntos_derrota: body.puntos_derrota,
        id_torneo: body.id_torneo,
        email: body.email,
    });

    grupo.save( (err, grupoDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            grupo: grupoDB
        })

    });
    
});


//editar redes sociales
app.put('/grupo/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'equipos_clasifican', 'goles_default', 'puntos_victoria', 'puntos_empate', 'puntos_derrota', 'id_torneo']);
            
    Grupo.findByIdAndUpdate(id, body, {new: true}, (err, grupoDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            grupo: grupoDB
        });
    }) 
});

//eliminar organizacion
app.delete('/grupo/:id', function (req, res) {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    Grupo.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, grupoBorrado) => {

        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(grupoBorrado.length === 0)
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Organizacion no encontrada'
                }
            });
        }

        res.json({
            ok:true,
            grupo: grupoBorrado
        })

    });
    
    // res.send('Delete usuarios')
});

module.exports = app;
