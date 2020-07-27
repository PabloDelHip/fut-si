const jwt = require('jsonwebtoken');

//=============
//VERIFICA TOKEN
//=============
let verificaToken = (req, res, next) =>{

    //Obtenemos los valores mediante el header
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if(err)
        {
            return res.status(401).json({
                ok:false,
                err
            });
        }
        
        req.ok = true;
        next();

    });

   

}

module.exports = {
    verificaToken
}