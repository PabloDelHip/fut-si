const express = require('express');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const golesPartido = require('../models/goles_partido');


const app = express();

//retornar todas las organizaciones
//BIEN//
//Opcional: fecha, inicio y final de listado, tipo gol, entre que minutos
app.get('/goles-partido', function (req, res) {

    let _condiciones="";
    let fecha = req.query.fecha || null;
    let tipo_gol = req.query.tipo_gol || null;
    let minuto = req.query.minuto || null;

    _condiciones =  condiciones(null,null,fecha,tipo_gol,minuto)

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 10;
    limite = Number(limite);

    golesPartido.find( { $and: _condiciones },'id_jugador id_partido minuto fecha tipo_gol')
            .skip(desde)
            .limit(limite)
            .exec( (err,goles_partido) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(goles_partido.length === 0)
                {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Goles por partidos no encontrados'
                        }
                    });
                }

                golesPartido.count({ $and: _condiciones }, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        goles_partido,
                        
                    });

                });
            });

  });



  //Opcional: fecha, inicio y final de listado, tipo gol, entre que minutos
  app.get('/goles-partido/jugador/:id', function (req, res) {

    let _condiciones="";
    let fecha = req.query.fecha || null;
    let tipo_gol = req.query.tipo_gol || null;
    let minuto = req.query.minuto || null;
    let id_jugador = req.params.id;

    _condiciones =  condiciones(id_jugador,null,fecha,tipo_gol,minuto);

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 10;
    limite = Number(limite);

    golesPartido.find( { $and: _condiciones },'id_jugador id_partido minuto fecha tipo_gol')
            .skip(desde)
            .limit(limite)
            .exec( (err,goles_partido) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(goles_partido.length === 0)
                {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Goles por partidos no encontrados'
                        }
                    });
                }

                golesPartido.count({ $and: _condiciones }, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        goles_partido,
                        
                    });

                });
            });

  });


  app.get('/goles-partido/partido/:id', function (req, res) {

    let _condiciones="";
    let fecha = req.query.fecha || null;
    let tipo_gol = req.query.tipo_gol || null;
    let minuto = req.query.minuto || null;
    let id_partido = req.params.id;

    _condiciones =  condiciones(null,id_partido,fecha,tipo_gol,minuto);

    golesPartido.find({ $and: _condiciones },'id_jugador id_partido minuto fecha tipo_gol')
            .exec( (err,goles_partido) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(goles_partido.length === 0)
                {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Goles por partidos no encontrados encontradas'
                        }
                    });
                }

                golesPartido.count({ $and: _condiciones }, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        goles_partido, 
                    });
                });
            });

  });
  
  app.get('/goles-partido/jugador/:id_jugador/partido/:id_partido', function (req, res) {

    let _condiciones="";
    let fecha = req.query.fecha || null;
    let tipo_gol = req.query.tipo_gol || null;
    let minuto = req.query.minuto || null;
    let id_jugador = req.params.id_jugador;
    let id_partido = req.params.id_partido;


    _condiciones =  condiciones(id_jugador,id_partido,fecha,tipo_gol,minuto);

    golesPartido.find({ $and: _condiciones },'id_jugador id_partido minuto fecha tipo_gol')
            .exec( (err,goles_partido) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(goles_partido.length === 0)
                {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Goles por partidos no encontrados encontradas'
                        }
                    });
                }

                golesPartido.count({ $and: _condiciones }, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        goles_partido, 
                    });
                });
            });

  });

//guardar datos
//BIEN
app.post('/goles-partido', function (req, res) {

    let body = req.body;
    let goles_partido = new golesPartido({
        id_jugador: body.id_jugador,
        id_partido: body.id_partido,
        minuto: body.minuto,
        fecha: body.fecha,
        tipo_gol: body.tipo_gol,
    });

    goles_partido.save( (err, golesPartidoDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            goles_partido: golesPartidoDB
        })

    });
    
});


//editar goles
app.put('/goles-partido/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['id_jugador', 'id_partido', 'minuto', 'fecha', 'tipo_gol']);

    golesPartido.findByIdAndUpdate(id, body, {new: true}, (err, golesPartidoDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            organizacion: golesPartidoDB
        });
    }) 
});

//eliminar goles
app.delete('/goles-partido/:id', function (req, res) {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    golesPartido.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, golesPartidoBorrado) => {

        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(golesPartidoBorrado.length === 0)
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
            goles_partido: golesPartidoBorrado
        })

    });
    
    // res.send('Delete usuarios')
});

module.exports = app;


//////FUNCIONES///
function condiciones(_id_jugador,_id_partido,_fecha, _tipo_gol, _minuto)
{
    let condiciones = [{
        estado: true
    }];

    let fecha = _fecha;
    let tipo_gol = _tipo_gol;
    let minuto = _minuto;
    let id_jugador = _id_jugador;
    let id_partido = _id_partido;

    if(id_jugador !== null)
    {
        condiciones.push({"id_jugador":id_jugador});
    }

    if(id_partido !== null)
    {
        condiciones.push({"id_partido":id_partido});
    }

    if(fecha !== null)
    {
        condiciones.push({"fecha":fecha});
    }

    if(tipo_gol !== null)
    {
        condiciones.push({"tipo_gol":tipo_gol});
    }

    if(minuto !== null)
    {
        condiciones.push({"minuto":minuto});
    }

     return condiciones;
}
