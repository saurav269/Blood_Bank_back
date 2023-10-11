const userModel = require("../Models/userModel")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");

const registerController = async(req,res) => {

    try{
        const existingUser = await userModel.findOne({email : req.body.email})

        //Validation
        if(existingUser){
            return res.status(200).send({
                success : false,
                message : 'User Already Register'
            })
        }
        //hash Password
        const salt = await bcrypt.genSalt(5)
        const hashedPassword =  await bcrypt.hash(req.body.password, salt)
        req.body.password = hashedPassword

        //rest data
        const user = new userModel(req.body)
        await user.save()
        return res.status(201).send({
            success : true,
            message:"User has been register successfully",
            user,
        })

    }catch(err){
        console.log(err)
        res.status(500).send({
            success : false,
            message : 'Error in Register api',
            err
        })
    }

}

const loginController=async(req,res)=>{

    try{
        const user = await userModel.findOne({email : req.body.email})
        if(!user){
            return res.status(404).send({
                success : false,
                message : 'User not Found'
            })
        }
        //CHECK ROLE
        if(user.role !== req.body.role){
            return res.status(404).send({
                success : false,
                message : 'Role does not match'
            })
        }
        //compare password
        const comparePassword = await bcrypt.compare(req.body.password, user.password)
        if(!comparePassword){
            res.status(500).send({
                success : false,
                message : 'Invalid Credential'
            })
        }
        const token = jwt.sign({userID : user._id}, process.env.JWT_SECURE, {expiresIn: "1d"})
        return res.status(200).send({
            success : true,
            message:"User has been Login successfully",
            token,
            user,
        })

    }catch(err){
        console.log(err)
        res.status(500).send({
            success : false,
            message : 'Error in Login API',
            err
        })
    }
};

//GET CURRENT USER
const currentUserController=async(req,res)=>{

    try{
        const user = await userModel.findOne({_id : req.body.userID})
        return res.status(200).send({
            success : true,
            message:"Getting User Details Successfully",
            user,
        })

    }catch(err){
        console.log(err)
        return res.status(500).send({
            success:false,
            message:"Unable to get User",
            err,
        })
    }
}

module.exports = {registerController, loginController, currentUserController}