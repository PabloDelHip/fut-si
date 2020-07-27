const express = require('express');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const ArchivoEquipo = require('../models/archivo_equipos');


const app = express();

//retornar todas las organizaciones
//BIEN//
app.get('/archivo-equipo', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);
    ArchivoEquipo.find({estado: true},'nombre archivo idEquipo estado')
            .skip(desde)
            .limit(limite)
            .exec( (err,archivo_equipo) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                ArchivoEquipo.count({ estado: true }, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        archivo_equipo,
                        
                    });

                });
            });

  });

//retornar todas las redes sociales filtradas por el ID del usuario
//BIEN
app.get('/archivo-equipo/:id', function (req, res) {

    let condiciones = {
        _id: req.params.id,
        estado: true
    }

    ArchivoEquipo.find(condiciones,'nombre archivo idEquipo estado')
            .exec( (err,archivo_equipo) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(ArchivoEquipo.length === 0)
                {
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'Archivo Equipo no encontrada'
                        }
                    });
                }

                ArchivoEquipo.count(condiciones, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        archivo_equipo,
                        
                    });

                });
            });

  });

//guardar datos
//BIEN
app.post('/archivo-equipo', function (req, res) {

    let body = req.body;
    let archivo_equipo = new ArchivoEquipo({
        nombre: body.nombre,
        archivo: body.archivo, 
        id_equipo: body.id_equipo
    });

    archivo_equipo.save( (err, archivo_equipoDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            archivo_equipo: archivo_equipoDB
        })

    });
    
});


//editar redes sociales
app.put('/archivo-equipo/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'archivo', 'id_equipo']);
            
    ArchivoEquipo.findByIdAndUpdate(id, body, {new: true}, (err, archivo_equipoDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            archivo: archivo_equipoDB
        });
    }) 
});

//eliminar organizacion
app.delete('/archivo-equipo/:id', function (req, res) {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    ArchivoEquipo.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, archivo_equipoDB) => {

        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(archivo_equipoDB.length === 0)
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Archivo Equipo no encontrada'
                }
            });
        }

        res.json({
            ok:true,
            archivo: archivo_equipoDB
        })

    });
    
    // res.send('Delete usuarios')
});

module.exports = app;
