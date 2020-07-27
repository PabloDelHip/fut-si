const express = require('express');
var cors = require('cors');
const bcrypt = require('bcrypt'); //libreria para poder encriptar las contraseñas
const _ = require('underscore'); //libreria para realizar diferentes funciones por el momento se esta usando para: validar los datos que vamos a mandar
                                //para el modelo, con la funcion PICK
const Estado = require('../models/estado');
const Municipio = require('../models/municipio');


const app = express();
app.use(cors())

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }


app.get('/estados' ,function (req, res) {

    Estado.find({},'nombre')
            .exec( (err,estados) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Estado.count({}, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        estados,
                        
                    });

                });
            });

});



app.get('/estado/municipios/:id', function (req, res) {

    let condiciones = {
        estado: req.params.id
    }

    Municipio.find(condiciones,'nombre')
            .exec( (err,municipio) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(municipio.length === 0)
                {
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'Municipios no encontrados'
                        }
                    });
                }

                Municipio.count(condiciones, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        municipio,
                        
                    });

                });
            });

  });

  app.get('/categoria/usuario/:id', function (req, res) {

    let condiciones = {
        id_usuario: req.params.id,
        estado: true
    }

    Categoria.find(condiciones,'titulo edad_minima edad_maxima id_usuario estado')
            .exec( (err,categoria) => {
                if(err)
                {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(categoria.length === 0)
                {
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'Aun no tiene categorias'
                        }
                    });
                }

                Categoria.count(condiciones, (err, total) => {
                    
                    res.json({
                        ok:true,
                        total,
                        categoria,
                        
                    });

                });
            });

  });

//guardar datos
//BIEN
app.post('/categoria', function (req, res) {

    let body = req.body;
    let edad_minima = Number(body.edad_minima);
    let edad_maxima = Number(body.edad_maxima);

    // return res.status(400).json({
    //     edad_minima,
    //     edad_maxima
    // });


    if(edad_minima >= edad_maxima)
    {
        return res.status(400).json({
            ok: false,
            err: "La edad minima no puede ser mayor a la edad maxima"
        });
    }

    let categoria = new Categoria({
        titulo: body.titulo,
        edad_minima, 
        edad_maxima: body.edad_maxima, 
        id_usuario: body.id_usuario, 
    });

    categoria.save( (err, categoriaDB) => {
       
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            categoria: categoriaDB
        })

    });
    
});


//editar redes sociales
app.put('/categoria/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['titulo', 'edad_minima', 'edad_maxima', 'id_usuario']);
            
    Categoria.findByIdAndUpdate(id, body, {new: true}, (err, categoriaDB) => {
        
        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    }) 
});

//eliminar organizacion
app.delete('/categoria/:id', function (req, res) {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }
    Categoria.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, categoriaBorrado) => {

        if(err)
        {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(categoriaBorrado.length === 0)
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok:true,
            categoria: categoriaBorrado
        })

    });
    
    // res.send('Delete usuarios')
});

module.exports = app;
