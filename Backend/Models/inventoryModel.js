const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema({
    inventoryType : {
        type : String,
        required :  true,
        enum : ['in','out']

    },
    bloodgroup : {
        type : String,
        required : [true,'Blood group required'],
        enum : ['O+','O-','AB+','AB-','A+','A-','B+','B-']
    },
    quantity : {
        type : Number,
        required : [true,'Blood quantity is required'],
    },
    email : {
        type : String,
        required : [true, 'Donar Email is Required']
    },
    organisation: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users',
        required : [true, 'Organisation is required']
    },
    hospital : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users',
        required : function(){
            return this.inventoryType === 'out'
        }
    },
    donar : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users',
        required : function(){
           return this.inventoryType === 'in' 
        }
    },
},{
    timestamps : true
});
module.exports=mongoose.model('Inventory', inventorySchema)