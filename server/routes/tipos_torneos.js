const express = require('express');
var cors = require('cors');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const tipoTorneo = require('../models/tipos_torneos');


const app = express();
app.use(cors())

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }


//retornar todas las organizaciones
//BIEN//
app.get('/tipos-torneos', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);
    tipoTorneo.find({estado: true},'nombre estado')
            .skip(desde)
            .limit(limite)
            .exec( (err,tipos_torneos) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                tipoTorneo.count({ estado: true }, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        tipos_torneos,
                        
                    });

                });
            });

  });

//retornar todas las redes sociales filtradas por el ID del usuario
//BIEN
app.get('/tipo-torneo/:id', function (req, res) {

    let condiciones = {
        _id: req.params.id,
        estado: true
    }

    tipoTorneo.find(condiciones,'titulo edad_minima edad_maxima id_usuario estado')
            .exec( (err,tipo_torneo) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(tipo_torneo.length === 0)
                {
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'Tipo Torneo no encontrado'
                        },
                        tipo_torneo
                    });
                }

                tipoTorneo.count(condiciones, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        tipo_torneo,
                        
                    });

                });
            });

  });

//guardar datos
//BIEN
app.post('/tipo_torneo', function (req, res) {

    let body = req.body;


    let tipo_torneo = new tipoTorneo({
        nombre: body.nombre, 
    });

    tipo_torneo.save( (err, tipoTorneoDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            tipo_torneo: tipoTorneoDB
        })

    });
    
});


//editar redes sociales
app.put('/tipo-torneo/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre']);
            
    tipoTorneo.findByIdAndUpdate(id, body, {new: true}, (err, tipo_torneoDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            tipo_torneo: tipo_torneoDB
        });
    }) 
});

//eliminar organizacion
app.delete('/categoria/:id', function (req, res) {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    tipoTorneo.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, tipo_torneoBorrado) => {

        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(tipo_torneoBorrado.length === 0)
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Tipo Torneo no encontrado'
                }
            });
        }

        res.json({
            ok:true,
            tipo_torneo: tipo_torneoBorrado
        })

    });
    
    // res.send('Delete usuarios')
});

module.exports = app;
