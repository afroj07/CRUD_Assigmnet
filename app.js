const express = require('express');
const app = express();
const authRouter=require('./router/authRoute.js');
const databaseconnect = require('./config/databaseConfig.js');
databaseconnect();
const cookieParser= require('cookie-parser');
app.use(cookieParser());
const cors = require("cors");
 app.use(cors({
    origin:[process.env.CLINT_URL],
    Credential:true
}))
app.use(express.json());
app.use('/api/auth/',authRouter);

app.use('/',(req , res)=>{
    res.status(200).json({data:'JWTH server'})

})
module.exports=app;