const express = require ('express')
const authMiddleware = require('../middlewres/authMiddleware')
const { bloodgroupDetailsControllers } = require('../Controllers/analyticsController')


const router = express.Router()

//routes
//GET ALL BLOODGROUP RECORDS
router.get('/bloodGroups-data',authMiddleware, bloodgroupDetailsControllers)

module.exports = router