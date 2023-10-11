
const express = require('express')
const authMiddleware = require('../middlewres/authMiddleware')
const { getDonarListController, getHospitalListController, getOrganisationListController, deleteDonarListController } = require('../Controllers/adminController')
const adminMiddleware = require('../middlewres/adminMiddleware')

//ROUTER OBJECT
const router = express.Router()

//ROUTES

//GET DONAR LIST 
router.get('/donar-list', authMiddleware,adminMiddleware, getDonarListController)

//GET HOSPITAL LIST 
router.get('/hospital-list', authMiddleware,adminMiddleware, getHospitalListController)

//GET ORGANISATION LIST 
router.get('/organisation-list', authMiddleware,adminMiddleware, getOrganisationListController)

//DELETE DONAR LIST 
router.delete('/delete-donar/:id', authMiddleware,adminMiddleware, deleteDonarListController)

//EXPORTS
module.exports = router;