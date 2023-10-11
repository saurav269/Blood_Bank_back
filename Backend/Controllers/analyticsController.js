const inventoryModel = require("../Models/inventoryModel");
const mongoose = require("mongoose");

 const bloodgroupDetailsControllers= async(req,res)=>{
    try{
        const bloodGroups = ['O+','O-','AB+','AB-','A+','A-','B+','B-'];
        const bloodGroupData = [];
        const organisation = new mongoose.Types.ObjectId(req.body.userID);

        //GET SINGLE BLOOD GROUP
        await Promise.all(bloodGroups.map(async(bloodgroup) => {
                //COUNTING TOTAL IN
                const totalIn = await inventoryModel.aggregate([
                    {$match : {
                        bloodgroup : bloodgroup,
                        inventoryType : 'in',
                        organisation,
                    }},
                    {
                        $group : {
                            _id : null,
                            total : {$sum : "$quantity"},
                        }
                    }
                ])
    
                 //COUNTING TOTAL OUT
                 const totalOut = await inventoryModel.aggregate([
                    {$match : {
                        bloodgroup : bloodgroup,
                        inventoryType : 'out',
                        organisation
                    }},
                    {
                        $group : {
                            _id : null,
                            total : {$sum : "$quantity"},
                        }
                    }
                ])
                //CALCULATE TOTAL
                const availableBlood = (totalIn[0]?.total || 0) -  (totalOut[0]?.total || 0)
    
                //PUSHING BLOOD DATA
                bloodGroupData.push({
                    bloodgroup,
                    totalIn : totalIn[0]?.total || 0,
                    totalOut : totalOut[0]?.total || 0,
                    availableBlood,
                })
            }))
        return res.status(200).send({
            success : true,
            message : "Getting Blood Group data Successfully",
            bloodGroupData,
        })
    }catch(err){
        console.log(err)
        res.status(500).send({
            success  : false,
            message : "Error in BloodGroup Data analytics API",
            err,
        })
    }

 }
 module.exports = {bloodgroupDetailsControllers}