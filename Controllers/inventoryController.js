const inventoryModel = require("../Models/inventoryModel")
const userModel = require("../Models/userModel")
const mongoose = require("mongoose")

//CREATE INVENTORY
const inventoryController = async(req,res) => {

    try{
        const {email} = req.body
        //VALIDATION
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(500).send({
                success : false,
                message : "User not found",
            })
        }
        // if(inventoryType === 'in' && user.role !== 'donar'){
        //     return res.status(500).send({
        //         success : false,
        //         message : "Not a donar account",
        //     })
        // }
        // if(inventoryType === 'out' && user.role !== 'hospital'){
        //     return res.status(500).send({
        //         success : false,
        //         message : "Not a Hospital account",
        //     })
        // }

        if (req.body.inventoryType == "out") {
          const requestedBloodgroup = req.body.bloodgroup;
          const requestedQuantityofBlood = req.body.quantity;
          const organisation = new mongoose.Types.ObjectId(req.body.userID);

          // CALCULATE BLOOD QUANTITY
          const totalofRequestedBlood = await inventoryModel.aggregate([
            {
              $match: {
                organisation,
                inventoryType: "in",
                bloodgroup: requestedBloodgroup,
              },
            },
            {
              $group: {
                _id: "$bloodgroup",
                total: { $sum: "$quantity" },
              },
            },
          ]);

        //   console.log("Total in", totalofRequestedBlood);
          const totalIn = totalofRequestedBlood[0]?.total || 0;

          // CALCULATE OUT BLOOD QUANTITY
          const totalOutofRequestedBlood = await inventoryModel.aggregate([
            {
              $match: {
                organisation,
                inventoryType: "out",
                bloodgroup: requestedBloodgroup,
              },
            },
            {
              $group: {
                _id: "$bloodgroup",
                total: { $sum: "$quantity" },
              },
            },
          ]);
          const totalOut = totalOutofRequestedBlood[0]?.total || 0;

          //IN AND OUT CALCULATION
          const availableQuantityOfBloodgroup = totalIn - totalOut;

          //CHECKING QUANTITY VALIDATION
          if (availableQuantityOfBloodgroup < requestedQuantityofBlood) {
            return res.status(500).send({
              success: false,
              message: `Only ${availableQuantityOfBloodgroup}ML of ${requestedBloodgroup.toUpperCase()} is available`,
            });
          }
          req.body.hospital = user?._id;
        }else{
            req.body.donar = user?._id
        }
        //SAVE RECORD
        const inventory = new inventoryModel(req.body)
        await inventory.save()
        return res.status(201).send({
            success : true,
            message : "New blood record has been added"
        })

    }catch(err){
        console.log(err)
        res.status(500).send({
            success : false,
            message : "Error in Inventory Api",
            err
        })
    }
}

//GET ALL BLOOD RECORDS
const getInventoryController=async(req,res)=>{

    try{
        const inventory = await inventoryModel.find({organisation : req.body.userID})
        .populate('donar').populate('hospital').sort({createdAt : -1});
        return res.status(200).send({
            success : true,
            message : 'Gettting all recodrs successfully',
            inventory,
        });
    }catch(err){
        console.log(err)
        res.status(500).send({
            success : false,
            message : 'Error in getting blood records API',
            err
        })
    }
}

//GET ALL HOSPITAL BLOOD RECORDS
const getInventoryHospitalController=async(req,res)=>{

  try{
      const inventory = await inventoryModel
        .find(req.body.filters)
        .populate("donar")
        .populate("hospital")
        .populate("organisation")
        .sort({ createdAt: -1 });
      return res.status(200).send({
        success: true,
        message: "Gettting hospital consumer recodrs successfuly",
        inventory,
      });
  }catch(err){
      console.log(err)
      res.status(500).send({
          success : false,
          message : 'Error in getting hospital consumer records API',
          err
      })
  }
}

//GET BLOOD RECORD OF 3
const getRecentInventoryController=async(req,res)=>{
  try{
    const inventory = await inventoryModel.find({
      organisation : req.body.userID,
    })
    .limit(3)
    .sort({createdAt : -1});
    return res.status(200).send({
      success : true,
      message : 'GETTING RECENT INVENTORY DATA',
      inventory,
    })

  }catch(err){
    console.log(err)
    res.status(500).send({
      success : false,
      message : 'ERROR IN BLLOD RECORD API',
      err,
    })
  }

}

//GET DONAR RECORDS
const getDonarsControllers=async(req,res)=>{
  try{
    const organisation = req.body.userID;
    //FIND DONARS
    const donarID = await inventoryModel.distinct("donar",{
      organisation
    });
    //console.log(donarID)
    const donars = await userModel.find({_id : {$in : donarID}});
    return res.status(201).send({
      success :  true,
      message : "GETTING DONARS RECORDS SUCCESSFULLY",
      donars,
    });
  }catch(err){
    console.log(err)
    return res.status(500).send({
      success : false,
      message : "Error IN Donar API",
      err
    })
  }
};

//GET HOSPITAL RECORDS
const getHospitalControllers=async(req,res)=>{
  try{

    const organisation = req.body.userID;
    //GET HOSPITAL-ID
    const hospitalId = await inventoryModel.distinct('hospital',{
      organisation
    });
    const hospitals = await userModel.find({
      _id : {$in : hospitalId}
    });
    return res.status(200).send({
      success :  true,
      message : "GETTING HOSPITAL RECORDS SUCCESSFULLY",
      hospitals,
    })

  }catch(err){
    console.log(err)
    res.status(500).send({
      success : false,
      message : "ERROR IN HOSPITAL API",
      err,
    })
  }
}

//GET ORGANISATION RECORDS
const getOrganisationController=async(req,res)=>{
  try{
    const donar = req.body.userID;
    const orgId = await inventoryModel.distinct('organisation',{donar});
    //FIND ORGANISATION
    const organisations = await userModel.find({
      _id : {$in : orgId}
    })
    return res.status(200).send({
      success : true,
      message : "GETTING ALL ORG DATA SUCCESSFULLY",
      organisations,
    })
  }catch(err){
    console.log(err)
    res.status(500).send({
      success : false,
      message : "Error in ORG API",
      err
    })
  }

}

//GET ORGANISATION for HOSPITAL RECORDS
const getOrganisationForHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userID;
    const orgId = await inventoryModel.distinct('organisation', { hospital });

    if (!orgId || orgId.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No organisations found for the given hospital.",
      });
    }

    // FIND ORGANISATION
    const organisations = await userModel.find({
      _id: { $in: orgId },
    });

    if (!organisations || organisations.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No organizations found for the given hospital.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "GETTING ALL HOSPITAL-ORG DATA SUCCESSFULLY",
      organisations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Error in HOSPITAL ORG API",
      error: err,
    });
  }
};

module.exports = {
  inventoryController,
  getInventoryController,
  getDonarsControllers,
  getHospitalControllers,
  getOrganisationController,
  getOrganisationForHospitalController,
  getInventoryHospitalController,
  getRecentInventoryController
};