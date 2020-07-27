const express = require('express');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const Equipo = require('../models/equipos');


const app = express();

//retornar todas las organizaciones
//BIEN//
app.get('/equipo', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);
    Equipo.find({estado: true},'nombre dia_favorito horario_favorito id_usuario uniforme_local uniforme_visita logo foto_equipo archivos_completos estado')
            .skip(desde)
            .limit(limite)
            .exec( (err,equipo) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Equipo.count({ estado: true }, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        equipo,
                        
                    });

                });
            });

  });

//retornar todas las redes sociales filtradas por el ID del usuario
//BIEN
app.get('/equipo/:id', function (req, res) {

    let condiciones = {
        _id: req.params.id,
        estado: true
    }

    Equipo.find(condiciones,'nombre dia_favorito horario_favorito id_usuario uniforme_local uniforme_visita logo foto_equipo archivos_completos estado')
            .exec( (err,equipo) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(equipo.length === 0)
                {
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'Equipo no encontrado'
                        }
                    });
                }

                Equipo.count(condiciones, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        equipo,
                        
                    });

                });
            });

  });

//guardar datos
//BIEN
app.post('/equipo', function (req, res) {

    let body = req.body;
    let estado_partidos = new estadoPartidos({
        nombre: body.nombre,
        dia_favorito: body.dia_favorito,
        horario_favorito: body.horario_favorito,
        id_usuario: body.id_usuario,
        uniforme_local: body.uniforme_local,
        uniforme_visita: body.uniforme_visita,
        logo: body.logo,
        archivos_completos: body.archivos_completos,
    });

    Equipo.save( (err, equipoDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            equipo: equipoDB
        })

    });
    
});


//editar redes sociales
app.put('/equipo/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'dia_favorito', 'horario_favorito', 'id_usuario', 'uniforme_local', 'uniforme_visita', 'logo', 'foto_equipo', 'archivos_completos']);
            
    Equipo.findByIdAndUpdate(id, body, {new: true}, (err, equipoDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            equipo: equipoDB
        });
    }) 
});

//eliminar organizacion
app.delete('/equipo/:id', function (req, res) {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    Equipo.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, equipoBorrado) => {

        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(equipoBorrado.length === 0)
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Equipo no encontrado'
                }
            });
        }

        res.json({
            ok:true,
            equipo: equipoBorrado
        })

    });
    
    // res.send('Delete usuarios')
});

module.exports = app;
