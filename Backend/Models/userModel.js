const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    role : {
        type:String,
        required : [true, 'role is required'],
        enum:['admin','organisation', 'donar', 'hospital']
    },
    name : {
        type : String,
        required : function(){
            if(this.role === 'user' || this.role === 'admin'){
                return true
            }else{
                return false
            }
        }
    },

    organisationName : {
        type:String,
        required : function(){
            if(this.role === 'organisation'){
                return true
            }else{
                return false
            }
        }
    },
    hospitalName : {
        type : String,
        required : function(){
            if(this.role === 'hospital'){
                return true
            }else{
                return false
            }
        }
    },

    email : {
        type : String,
        required : [true, 'email is required'],
        unique : true,
    },
    password : {
        type : String,
        required : [true, 'Password is required'],
    },
    website :{
        type : String
    },
    address : {
        type : String,
        required : [true, 'address is required'],
        unique : true,
    },
    phone : {
        type : String,
        required : [true, 'phone is required'],
        unique : true,
    },
},{timestamps : true})

module.exports = mongoose.model('users', userSchema)