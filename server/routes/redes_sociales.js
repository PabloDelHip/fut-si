const express = require('express');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const RedesSociales = require('../models/redes_sociales');


const app = express();

////////////////////
  ////////////TODO LO DE ORGANIZACIONES QUEDO PENDIENTE DE VALIDACION/////////////////////////
  /////////////////////////////////////////////////////////////////////////////


//retornar todas las redes sociales filtradas por el ID del usuario
//BIEN
app.get('/redes-sociales/usuario/:id', function (req, res) {

    getRedesSociales(req.params.id,res);

  });

  //retornar todas las redes sociales filtyradas or el ID de la organizacion
app.get('/redes-sociales/organizacion/:id', function (req, res) {

   
    getRedesSociales(req.params.id,res);

  });

//guardar datos
//BIEN
app.post('/redes-sociales/usuario', function (req, res) {

    let body = req.body;
    let redes_sociales = new RedesSociales({
        facebook: body.facebook,
        twitter: body.twitter,
        google_plus: body.google_plus,
        instagram: body.instagram,
        youtube: body.youtube,
        vimeo: body.vimeo,
        pinterest: body.pinterest,
        linkedin: body.linkedin,
        flickr: body.flickr,
        usuario_id: body.usuario_id
    });

    redes_sociales.save( (err, redesSocialesDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        redesSocialesDB.password = null;

        res.json({
            ok:true,
            usuario: redesSocialesDB
        })

    });
    
});

//guardar datos organizacion
app.post('redes-sociales/organizacion', function (req, res) {

    let body = req.body;
    let redes_sociales = new RedesSociales({
        facebook: body.facebook,
        twitter: body.twitter,
        google_plus: body.google_plus,
        instagram: body.instagram,
        youtube: body.youtube,
        vimeo: body.vimeo,
        pinterest: body.pinterest,
        linkedin: body.linkedin,
        flickr: body.flickr
    });

    redes_sociales.save( (err, redesSocialesDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        redesSocialesDB.password = null;

        res.json({
            ok:true,
            usuario: redesSocialesDB
        })

    });
    
});

//editar redes sociales
app.put('/redes-sociales/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['facebook', 'twitter', 'google_plus', 'instagram', 'youtube', 'vimeo', 'pinterest', 'linkedin', 'flickr']);

    RedesSociales.findByIdAndUpdate(id, body, {new: true}, (err, redesSocialesDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            redes_sociales: redesSocialesDB
        });
    }) 
});

module.exports = app;

//Funciones

function getRedesSociales(usuario_id,res)
{
    let condiciones = {
        usuario_id
    }

    //el find es con los corchetes vacios es como si hicieramos un select * from tabla
    //el skip es para indicar desde que numero de registro queremos que comience a mostrar
    //limit es para indicarle cuantos registros queremos que muestre
    //la segunda condicion es para indicar que campos queremos mostrar
    RedesSociales.find(condiciones,'facebook twitter google_plus instagram youtube vimeo pinterest linkedin flickr usuario_id')
            .exec( (err,redes_sociales) => {

                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(redes_sociales.length === 0)
                {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Redes sociales del usuario no encontradas'
                        }
                    });
                }
                
                res.json({
                    ok:true,
                    redes_sociales,
                });

                
            });
}