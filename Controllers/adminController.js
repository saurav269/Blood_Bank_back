const userModel = require("../Models/userModel")

//GET DONAR LIST
const getDonarListController=async(req,res)=>{
    try{
        const donarData = await userModel
          .find({ role: "donar" })
          .sort({ createdAt: -1 });
          return res.status(200).send({
            success : true,
            TotalCount : donarData.length,
            message : "GETTING ALL DONAR LIST DATA SUCCESSFULLY",
            donarData
          })

    }catch(err){
        console.log(err)
        return res.status(500).send({
            success : false,
            message : "Error in Donar List API",
            err
        })
    }

}

//GET HOSPITAL LIST
const getHospitalListController=async(req,res)=>{
    try{
        const hospitalData = await userModel
          .find({ role: "hospital" })
          .sort({ createdAt: -1 });
          return res.status(200).send({
            success : true,
            TotalCount : hospitalData.length,
            message : "GETTING ALL HOSPITAL LIST DATA SUCCESSFULLY",
            hospitalData,
          })

    }catch(err){
        console.log(err)
        return res.status(500).send({
            success : false,
            message : "Error in HOSPITAL List API",
            err
        })
    }
}

//GET ORGANISATION LIST
const getOrganisationListController=async(req,res)=>{
    try{
        const orgData = await userModel
          .find({ role: "organisation" })
          .sort({ createdAt: -1 });
          return res.status(200).send({
            success : true,
            TotalCount : orgData.length,
            message : "GETTING ALL ORG LIST DATA SUCCESSFULLY",
            orgData,
          })
    }catch(err){
        console.log(err)
        return res.status(500).send({
            success : false,
            message : "Error in ORGANISATION List API",
            err
        })
    }
}

//DELETE DONAR
const deleteDonarListController=async(req,res)=>{
    try{
        await userModel.findByIdAndDelete(req.params.id)
        return res.status(200).send({
            success : true,
            message : "Record Deleted Successfully"
        })

    }catch(err){
        console.log(err)
        res.status(500).send({
            success : false,
            message : 'Error in Delete API',
            err,
        })
    }

}

//EXPORTS
module.exports = {getDonarListController, getHospitalListController, getOrganisationListController, deleteDonarListController}