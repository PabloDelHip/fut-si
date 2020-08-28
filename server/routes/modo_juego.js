const express = require('express');
var cors = require('cors');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const ModosJuego = require('../models/modo_juego');


const app = express();
app.use(cors())

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }


//retornar todas las organizaciones
//BIEN//
app.get('/modos_juego', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);
    ModosJuego.find({estado: true},'nombre descripcion estado')
            .skip(desde)
            .limit(limite)
            .exec( (err,modos_juego) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                ModosJuego.count({ estado: true }, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        modos_juego,
                        
                    });

                });
            });

  });


//guardar datos
//BIEN
app.post('/modos_juego', function (req, res) {

    let body = req.body;


    let modo_juego = new ModosJuego({
        nombre: body.nombre,
        descripcion: body.descripcion
    });

    modo_juego.save( (err, modoJuegoDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            modo_juego: modoJuegoDB
        })

    });
    
});

module.exports = app;
