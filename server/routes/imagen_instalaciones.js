const express = require('express');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const ImagenInstalacion = require('../models/imagen_instalaciones');
const fs = require('fs');


const app = express();

//retornar todas las organizaciones
//BIEN//
// app.get('/save-imagenes-instalaciones', function (req, res) {

//     const path = 'server/images/instalaciones/'+Date.now()+'.png';
 
//     // to convert base64 format into random filename
//     const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        
//     fs.writeFileSync(path, base64Data,  {encoding: 'base64'});

//     res.json({
//         ok:true,
//         bien:"Bien vato"
//     });

//   });

app.post('/save-imagenes-instalaciones', function (req, res) {

    let body = req.body;
    const path = 'public/images/instalaciones/'+Date.now()+'.png';
 
    const imgdata = body.imagen_base64;// to convert base64 format into random filename
    const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        
    

    try {
        fs.writeFileSync(path, base64Data,  {encoding: 'base64'});

        let imagen_instalacion = new ImagenInstalacion({
            nombre: path,
            instalacion: body.id_instalacion,
        });
    
        imagen_instalacion.save( (err, imagen_instalacionDB) => {
           
            if(err)
            {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
    
            res.json({
                ok:true,
                imagen_instalacion: imagen_instalacionDB
            })
    
        });

    } catch(e) {
        return res.json({
            ok:false,
            err:e
        });
    }
    
    
    
});

//retornar todas las redes sociales filtradas por el ID del usuario
//BIEN
app.get('/imagenes-instalaciones/:id', function (req, res) {
    
    let condiciones = {
        instalacion: req.params.id,
        estado: true
    }

    ImagenInstalacion.find(condiciones,'nombre instalacion')
            .exec( (err,imagenes_instalaciones) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok:true,
                    imagenes_instalaciones,
                });
            });

  });


//editar redes sociales
app.put('/imagenes-instalaciones/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'equipos_clasifican', 'goles_default', 'puntos_victoria', 'puntos_empate', 'puntos_derrota', 'id_torneo']);
            
    Grupo.findByIdAndUpdate(id, body, {new: true}, (err, grupoDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            grupo: grupoDB
        });
    }) 
});

//eliminar organizacion
app.delete('/imagenes-instalaciones/:id', function (req, res) {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    ImagenInstalacion.updateMany ( {"instalacion": id } , {$set:{estado: false} }, {"multi": true}, function ( err , imagen_instalacionBorrado ) {
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(imagen_instalacionBorrado.length === 0)
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'imagenes no encontrada'
                }
            });
        }

        res.json({
            ok:true,
            imagen_instalacionBorrado: imagen_instalacionBorrado
        })
      });
});

module.exports = app;
