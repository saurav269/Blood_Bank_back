const userModel = require("../Models/userModel")

module.exports = async(req,res,next) =>{
    try{
        const user = await userModel.findById(req.body.userID);
        //CHECK ADMIN
        if(user?.role !== 'admin'){
            return res.status(401).send({
                success : false,
                message : "Auth failed",
            })
        }else{
            next()
        }

    }catch(err){
        console.log(err)
       return res.status(401).send({
            success : false,
            message : "Auth failed in Admin API",
            err,
        })
    }

}