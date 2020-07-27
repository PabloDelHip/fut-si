const express = require('express');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const Tabla = require('../models/tabla');


const app = express();

//retornar todas las organizaciones
//BIEN//
app.get('/tabla', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);
    Tabla.find({estado: true},'jugados partidos_ganados partidos_empatados partidos_perdidos goles_favor goles_contra id_equipo id_torneo estado')
            .skip(desde)
            .limit(limite)
            .exec( (err,tabla) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                
                Tabla.count({ estado: true }, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        tabla,
                        
                    });

                });
            });

  });

//retornar todas las redes sociales filtradas por el ID del usuario
//BIEN
app.get('/tabla/:id', function (req, res) {

    let condiciones = {
        _id: req.params.id,
        estado: true
    }

    Tabla.find(condiciones,'jugados partidos_ganados partidos_empatados partidos_perdidos goles_favor goles_contra id_equipo id_torneo estado')
            .exec( (err,tabla) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(tabla.length === 0)
                {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Tabla no encontrada'
                        }
                    });
                }

                Tabla.count(condiciones, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        tabla,
                        
                    });

                });
            });

  });

//guardar datos
//BIEN
app.post('/tabla', function (req, res) {

    let body = req.body;
    let tabla = new Tabla({
        jugados: body.jugados,
        partidos_ganados: body.partidos_ganados,
        partidos_empatados: body.partidos_empatados,
        partidos_perdidos: body.partidos_perdidos,
        goles_favor: body.goles_favor,
        goles_contra: body.goles_contra,
        id_equipo: body.id_equipo,
        id_torneo: body.id_torneo
    });

    tabla.save( (err, tablaDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            tabla:tablaDB
        })

    });
    
});



app.put('/tabla/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['jugados', 'partidos_ganados', 'partidos_empatados', 'partidos_perdidos', 'goles_favor', 'goles_contra', 'id_equipo', 'id_torneo']);
            
    Tabla.findByIdAndUpdate(id, body, {new: true}, (err, tablaDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            tabla: tablaDB
        });
    }) 
});

//eliminar organizacion
app.delete('/tabla/:id', function (req, res) {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    Tabla.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, tablaBorrado) => {

        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(tablaBorrado.length === 0)
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'tabla no encontrada'
                }
            });
        }

        res.json({
            ok:true,
            tabla: tablaBorrado
        })

    });
    
    // res.send('Delete usuarios')
});

module.exports = app;
