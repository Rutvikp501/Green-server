const mongoose = require("mongoose");
const dotenv = require('dotenv').config()

const DB_HOST = process.env.DB_HOST
const connectDB =async()=>{ mongoose.set('strictQuery', true)
    mongoose.connect(`${DB_HOST}`).then(()=>{
  console.log("Connected to DB");
}).catch((e)=>{
  console.log("Unable to connect  ")
  console.log(e);
})}


module.exports = connectDB;
//pm2 start ecosystem.config.js --env Home --watch

