 

 const mongoose = require("mongoose")

 const connectDB = async() => {
      try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to Db")

      }catch(err) {
        console.log(`Mongo Database error ${err}`)
      }
 }
 module.exports = connectDB