const express = require('express');
var cors = require('cors');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const Instalacion = require('../models/instalaciones');


const app = express();
app.use(cors())

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

//retornar todas las organizaciones
//BIEN//
app.get('/instalacion', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);
    Instalacion.find({estado: true},'nombre estado_pais municipio direccion codigo_postal telefono celular email sitio_web latitud_map longitud_map vestuarios camisetas estacionamiento cafeteria restaurante tiendas notas estado')
            .skip(desde)
            .limit(limite)
            .exec( (err,instalacion) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Instalacion.count({ estado: true }, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        instalacion,
                        
                    });

                });
            });

  });

//retornar todas las redes sociales filtradas por el ID del usuario
//BIEN
app.get('/instalacion/:id', function (req, res) {

    let condiciones = {
        _id: req.params.id,
        estado: true
    }

    Instalacion.find(condiciones,'nombre estado_pais municipio direccion codigo_postal telefono celular email sitio_web latitud_map longitud_map vestuarios camisetas estacionamiento cafeteria restaurante tiendas notas estado')
            .exec( (err,instalacion) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(instalacion.length === 0)
                {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Instalacion no encontrada'
                        }
                    });
                }

                Instalacion.count(condiciones, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        instalacion,
                        
                    });

                });
            });

  });

//guardar datos
//BIEN
app.post('/instalacion', function (req, res) {

    let body = req.body;
    let instalacion = new Instalacion({
        nombre: body.nombre,
        estado_pais: body.estado_pais,
        municipio: body.municipio,
        direccion: body.direccion,
        codigo_postal: body.codigo_postal,
        telefono: body.telefono,
        celular: body.celular,
        email: body.email,
        sitio_web: body.sitio_web,
        latitud_map: body.latitud_map,
        longitud_map: body.longitud_map,
        vestuarios: body.vestuarios,
        camisetas: body.camisetas,
        estacionamiento: body.estacionamiento,
        cafeteria: body.cafeteria,
        restaurante: body.restaurante,
        tiendas: body.tiendas,
        notas: body.notas,
        usuario: body.usuario
    });

    instalacion.save( (err, instalacionDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err,
                body: req.body
            });
        }

        res.json({
            ok:true,
            instalacion: instalacionDB
        })

    });
    
});


//editar redes sociales
app.put('/instalacion/:id', function (req, res) { 
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'estado_pais', 'municipio', 'direccion', 'codigo_postal', 'telefono', 'celular', 'email', 'sitio_web', 'latitud_map', 'longitud_map', 'vestuarios', 'camisetas', 'estacionamiento', 'cafeteria', 'restaurante', 'tiendas', 'notas']);
            
    Instalacion.findByIdAndUpdate(id, body, {new: true}, (err, instalacionDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            instalacion: instalacionDB
        });
    }) 
});

//eliminar organizacion
app.delete('/instalacion/:id', function (req, res) {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    Instalacion.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, instalacionBorrado) => {

        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(instalacionBorrado.length === 0)
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
            organizacion: instalacionBorrado
        })

    });
    
    // res.send('Delete usuarios')
});

module.exports = app;
