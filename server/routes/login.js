const express = require('express');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const jwt = require('jsonwebtoken'); //libreria para generar los tokens
const Usuario = require('../models/usuario');
const { verificaToken} = require('../middlewares/autenticacion');


const app = express();

app.post('/login',(req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) =>{
        if(err)
        {
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuarioDB)
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        if(!bcrypt.compareSync(body.password, usuarioDB.password))
        {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok:true,
            usuario: usuarioDB,
            token
        });
    })
});

//retornar todos los usuarios
app.get('/validar-token', verificaToken ,(req, res) => {

    return res.json({
        ok: req.ok,
        message: "Token valido",
    });

  });


module.exports = app;
