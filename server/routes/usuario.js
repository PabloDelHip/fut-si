const express = require('express');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const Usuario = require('../models/usuario');
const { verificaToken} = require('../middlewares/autenticacion');

const app = express();


//retornar todos los usuarios
app.get('/usuario', verificaToken ,(req, res) => {

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
   
    //el find es con los corchetes vacios es como si hicieramos un select * from tabla
    //el skip es para indicar desde que numero de registro queremos que comience a mostrar
    //limit es para indicarle cuantos registros queremos que muestre
    //la segunda condicion es para indicar que campos queremos mostrar
    Usuario.find({estado: true},'nombre email role estado foto')
            .skip(desde)
            .limit(limite)
            .exec( (err,usuarios) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                //de esta manera sabemos el total de registros que retorna
                //los corchetes son la codicion que le queremos indicar como en el find
                Usuario.count({estado:true}, (err, total) => {
                    
                    res.json({
                        ok:true,
                        usuarios,
                        total
                    });

                });

                
            });

  });

//retornar un usuario por su id
app.get('/usuario/:id', verificaToken , (req, res) => {
    
    let condiciones = {
        _id: req.params.id,
        estado: true
    }

    Usuario.find(condiciones,'nombre apellidos email sexo fecha_nacimiento sitio_web telefono estado celular foto role')
            .exec( (err,usuarios) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(usuarios)
                {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Usuario no encontrado'
                        }
                    });
                }

                res.json({
                    ok:true,
                    usuarios,
                });

                
            });

  });

//guardar datos
app.post('/usuario', verificaToken , (req, res) => {

    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        apellidos: body.apellido,
        sexo: body.sexo,
        fecha_nacimiento: body.fecha_nacimiento,
        sitio_web: body.sitio_web,
        telefono: body.telefono,
        celular: body.celular,
        email: body.email,
        password: bcrypt.hashSync(body.password,10), //encriptamos la contraseña
        role: body.role
    });

    usuario.save( (err, usuarioDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        usuarioDB.password = null;

        res.json({
            ok:true,
            usuario: usuarioDB
        })

    });
    
});

//obtener usuario por id
app.put('/usuario/:id', verificaToken , (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','email','img','role','estado']);

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

    
});

//eliminar usuario
app.delete('/usuario/:id', verificaToken , (req, res) => {
    
    let id = req.params.id;

    //eliminar un elemento de la BD de manera permanente
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioBorrado) => {

        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(usuarioBorrado === null)
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok:true,
            usuario: usuarioBorrado
        })

    });
    
    // res.send('Delete usuarios')
});

module.exports = app;