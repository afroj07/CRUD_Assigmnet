const mongoose = require('mongoose')

const MONGODB_URL= process.env.MONGODB_URL||'mongodb://127.0.0.1:27017/config';
const databaseconnect= async()=>{
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("Connected to DataBase:");
    } catch (error) {
        console.log("ERROR find",error.message);
    }
}
module.exports=databaseconnect;