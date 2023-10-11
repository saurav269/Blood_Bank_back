const express = require('express')
const { registerController, loginController, currentUserController } = require('../Controllers/authController')
const authMiddleware = require('../middlewres/authMiddleware')

const router =  express.Router()

//Routes
//REGISTER || POST
router.post('/register', registerController)

//LOGIN || POST
router.post('/login',loginController)

//GET CURRENT USER || GET
router.get('/current-user',authMiddleware, currentUserController)

module.exports = router