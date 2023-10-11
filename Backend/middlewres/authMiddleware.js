const JWT = require('jsonwebtoken')

module.exports = async(req,res,next)=>{

    try{
        const token = req.headers['authorization'].split(" ")[1]
        JWT.verify(token, process.env.JWT_SECURE, (err,decode) => {

            if(err){
                return res.status(401).send({
                    success:false,
                    message:'Auth Failed'
                })
            }else{
                req.body.userID = decode.userID
                next()
            }
        });
    }catch(err){
        console.log(err)
        res.send(500).send({
            success : false,
            err,
            message : 'Authentication Failed'
        })
    }
}