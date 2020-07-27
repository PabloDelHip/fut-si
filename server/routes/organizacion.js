const express = require('express');
var cors = require('cors');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const Organizacion = require('../models/organizacion');


const app = express();
app.use(cors())

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
//retornar todas las organizaciones
//BIEN//
app.get('/organizacion', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);
    Organizacion.find({estado: true},'titulo pais tipo_moneda horario direccion codigo_postal telefono email estado')
            .skip(desde)
            .limit(limite)
            .exec( (err,organizacion) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok:true,
                    organizacion
                });
            });

  });

//retorna una organizacion en especifico
//BIEN
app.get('/organizacion/:id/:id_usuario', function (req, res) {

    let condiciones = {
        _id: req.params.id,
        usuario: req.params.id_usuario,
        estado: true
    }

    Organizacion.find(condiciones,'titulo estado_pais municipio tipo_moneda direccion codigo_postal telefono celular email sitio_web notas')
            .exec( (err,organizaciones) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(organizaciones.length === 0)
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
                    organizaciones,
                });
            });

  });

  //Retorna todas las organizaciones
  app.get('/organizacion/:id_usuario', function (req, res) {

    let condiciones = {
        usuario: req.params.id_usuario,
        estado: true
    }

    Organizacion.find(condiciones,'titulo estado_pais municipio tipo_moneda direccion codigo_postal telefono celular email sitio_web notas')
            .exec( (err,organizaciones) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(organizaciones.length === 0)
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
                    organizaciones,
                });
            });

  });

//guardar datos
//BIEN
app.post('/organizacion', function (req, res) {

    let body = req.body;
    let organizacion = new Organizacion({
        titulo: body.titulo,
        estado_pais: body.estado_pais,
        municipio: body.municipio,
        direccion: body.direccion,
        codigo_postal: body.codigo_postal,
        telefono: body.telefono,
        celular: body.celular,
        email: body.email,
        sitio_web: body.sitio_web,
        notas: body.notas,
        usuario: body.usuario
    });

    organizacion.save( (err, organizacionDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            organizacion: organizacionDB
        })

    });
    
});


//editar redes sociales
app.put('/organizacion/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['titulo', 'estado_pais', 'municipio', 'tipo_moneda', 'direccion', 'codigo_postal', 'telefono', 'celular', 'email', 'sitio_web', 'notas']);
            
    Organizacion.findByIdAndUpdate(id, body, {new: true}, (err, organizacionDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            organizacion: organizacionDB
        });
    }) 
});




//eliminar organizacion
app.delete('/organizacion/:id', function (req, res) {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    Organizacion.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, organizacionBorrado) => {

        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(organizacionBorrado.length === 0)
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
            organizacion: organizacionBorrado
        })

    });
    
    // res.send('Delete usuarios')
});

module.exports = app;
