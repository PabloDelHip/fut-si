const express = require('express');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const Partidos = require('../models/partidos');


const app = express();

//retornar todas las organizaciones
//BIEN//
app.get('/partido', function (req, res) {


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);
    Partidos.find({estado: true},'jornada id_grupo id_equipo_uno id_equipo_dos goles_equipo_uno goles_equipo_dos id_estado_partido nota_albitro notas_albitro_imagen notas_imagen fecha hora id_arbitro estado')
            .skip(desde)
            .limit(limite)
            .exec( (err,partido) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok:true,
                    partido
                });
            });

  });

//retornar todas las redes sociales filtradas por el ID del usuario
//BIEN
app.get('/partido/:id', function (req, res) {

    let condiciones = {
        _id: req.params.id,
        estado: true
    }

    Partidos.find(condiciones,'jornada id_grupo id_equipo_uno id_equipo_dos goles_equipo_uno goles_equipo_dos id_estado_partido nota_albitro notas_albitro_imagen notas_imagen fecha hora id_arbitro estado')
            .exec( (err,partido) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(partido.length === 0)
                {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Partido no encontrado'
                        }
                    });
                }

                res.json({
                    ok:true,
                    partido,
                });
            });

  });



//guardar datos
//BIEN
app.post('/partido', function (req, res) {

    let body = req.body;
    let partido = new Partidos({
        jornada: body.jornada,
        id_grupo: body.id_grupo,
        id_equipo_uno: body.id_equipo_uno,
        id_equipo_dos: body.id_equipo_dos,
        goles_equipo_uno: body.goles_equipo_uno,
        goles_equipo_dos: body.goles_equipo_dos,
        id_estado_partido: body.id_estado_partido,
        nota_albitro: body.nota_albitro,
        notas_albitro_imagen: body.notas_albitro_imagen,
        notas_imagen: body.notas_imagen,
        fecha: body.fecha,
        hora: body.hora,
        id_arbitro: body.id_arbitro,
    });
    partido.save( (err, partidoDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            partido: partidoDB
        })

    });
    
});


//editar redes sociales
app.put('/partido/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['jornada', 'id_grupo', 'id_equipo_uno', 'id_equipo_dos', 'goles_equipo_uno', 'goles_equipo_dos', 'id_estado_partido', 'nota_albitro', 'notas_albitro_imagen', 'notas_imagen', 'fecha', 'hora', 'id_arbitro']);
            
    Partidos.findByIdAndUpdate(id, body, {new: true}, (err, partidoDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            partido: partidoDB
        });
    }) 
});

//eliminar organizacion
app.delete('/partido/:id', function (req, res) {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    Partidos.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, partidoBorrado) => {

        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(partidoBorrado.length === 0)
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Partido no encontrado'
                }
            });
        }

        res.json({
            ok:true,
            partido: partidoBorrado
        })

    });
    
    // res.send('Delete usuarios')
});

module.exports = app;
