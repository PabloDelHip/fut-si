const express = require('express');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const Jugador = require('../models/jugadores');


const app = express();


//retornar todos los usuarios
app.get('/jugador', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
   
    //el find es con los corchetes vacios es como si hicieramos un select * from tabla
    //el skip es para indicar desde que numero de registro queremos que comience a mostrar
    //limit es para indicarle cuantos registros queremos que muestre
    //la segunda condicion es para indicar que campos queremos mostrar
    Jugador.find({estado: true},'nombre apellidos fecha_nacimiento sexo direccion codigo_postal estatura peso email telefono celular numero_preferido goles partidos_jugados id_nacionalidad id_ciudad')
            .skip(desde)
            .limit(limite)
            .exec( (err,jugadores) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                //de esta manera sabemos el total de registros que retorna
                //los corchetes son la codicion que le queremos indicar como en el find
                Jugador.count({estado:true}, (err, total) => {
                    
                    res.json({
                        ok:true,
                        jugadores,
                        total
                    });

                });

                
            });

  });

//retornar un usuario por su id
app.get('/jugador/:id', function (req, res) {
    
    let condiciones = {
        _id: req.params.id,
        estado: true
    }

    Jugador.find(condiciones,'nombre apellidos fecha_nacimiento sexo direccion codigo_postal estatura peso email telefono celular numero_preferido goles partidos_jugados id_nacionalidad id_ciudad')
            .exec( (err,jugadores) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(jugadores.length === 0)
                {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Jugador no encontrado'
                        }
                    });
                }

                res.json({
                    ok:true,
                    jugadores,
                });

                
            });

  });

//guardar datos
app.post('/jugador', function (req, res) {

    let body = req.body;
    let jugador = new Jugador({
        nombre: body.nombre,
        apellidos: body.apellido,
        fecha_nacimiento: body.fecha_nacimiento,
        sexo: body.sexo,
        direccion: body.direccion,
        codigo_postal: body.codigo_postal,
        estatura: body.estatura,
        peso: body.peso,
        email: body.email,
        telefono: body.telefono,
        celular: body.celular,
        numero_preferido: body.numero_preferido,
        goles: body.goles,
        partidos_jugados: body.partidos_jugados,
        id_nacionalidad: body.id_nacionalidad,
        id_ciudad: body.id_ciudad,
    });

    jugador.save( (err, jugadorDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            jugador: jugadorDB
        })

    });
    
});

//obtener usuario por id
app.put('/jugador/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'apellidos', 'fecha_nacimiento', 'sexo', 'direccion', 'codigo_postal', 'estatura', 'peso', 'email', 'telefono', 'celular', 'numero_preferido', 'goles', 'partidos_jugados', 'id_nacionalidad', 'id_ciudad']);

    Jugador.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, jugadorDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: jugadorDB
        });
    })

    
});

//eliminar usuario
app.delete('/jugador/:id', function (req, res) {
    
    let id = req.params.id;

    //eliminar un elemento de la BD de manera permanente
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    let cambiaEstado = {
        estado: false
    }
    Jugador.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, jugadorBorrado) => {

        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(jugadorBorrado === null)
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
            usuario: jugadorBorrado
        })

    });
    
    // res.send('Delete usuarios')
});

module.exports = app;