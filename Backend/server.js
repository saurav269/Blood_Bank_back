

const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const connectDB = require("./Config/db")
const jwt = require('jsonwebtoken')

//rest object
const app = express()

//middlewares
app.use(express.json())
app.use(cors())

//dot config
dotenv.config()
//mongodb connection
connectDB()

//Routes
app.use('/api/v1/auth', require('./Routes/authRoute'));
app.use('/api/v1/inventory', require('./Routes/inventoryRoute'));
app.use('/api/v1/analytics', require('./Routes/analyticsRoute'));
app.use('/api/v1/admin', require('./Routes/adminRoute'));

//PORT
const PORT = process.env.PORT || 8000

//ROUTES
app.get("/", (req,res)=>{
    res.status(200).json({
        message : "Welcome to Blood Bank Application."
    })
})

//listen
app.listen(PORT, ()=>{
    console.log(`My server is running on ${process.env.PORT}`)
})