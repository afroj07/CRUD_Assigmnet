const userModel = require("../model/userschema");
const emailValidator = require('email-validator');
const bcrypt  = require('bcrypt');
const signup= async(req,res,next)=>{
    const {name, email,password, confirmPassword}=req.body;
      console.log(name, email, password, confirmPassword);
      if(!name||!email||!password||!confirmPassword){
        res.status(400).json({
          success:false,
          message:"Every field is required"
        })
      }
      const validEmail = emailValidator.validate(email);
      if(!validEmail){
        res.status(400).json({
          success:false,
          message:"please provide valid email"
        }) 
      }
      if(password!==confirmPassword){
        res.status(400).json({
          success:false,
          message:"Confirm password not match"
        })
      }
      try {
        const  userInfo= userModel(req.body);
        const result =  await userInfo.save();
        return res.status(200).json({
          success:true,
          data:result
      });
    }  catch (error) {
      if(error===11000){
        return res.status(400).json({
          success:false,
          message:'Account already exist with provide id'
        })
      }
        return res.status(400).json({
          success:false,
          message:error.message
        })
      
   }  
}
const signin = async(req,res,next)=>{
  const{ email, password}= req.body;
  if(!email||!password){
    res.status(400).json({
      success:false,
      message:"Every field is mandatory"
    })
  }
  const user = await userModel
  .findOne({
    email
  })
  .select('+password');
  if(!user|| !( await bcrypt.compare(password, user.password))){
    res.status(400).json({
      success:false,
      message:"Invalid credentials"
    })
  }
  try {
    const token = user.jwtToken();
  user.password=undefined;
  const cookieOption={
    maxAge:24*60*60*1000,
    httpOnly:true
  };
  res.cookie("token",token,cookieOption);
  res.status(200).json({
    success:true,
    data:user
  })

} catch (error) {
    res.status(400).json({
      success:false,
      message:error.message
    })
  }
} 
const getUser= async(req,res,next)=>{
  const userId= req.user.Id;
  try {
    const user= await userModel.findById(userId);
    return res.status(200).json({
      success: true,
      data:user
    });
  } catch (e) {
     return res.success(400).json({
      success:false,
      message:e.message
     })
  }
}
const logout=(req,res)=>{
  try {
    const cookieOption ={
      expires:new Date(),
      httpOnly:true
    }
    res.cookie("token",null,cookieOption);
   return res.status(200).json({
      success:true,
      message:"Logged Out"
    })
  } catch (e) {
    return res.status(400).json({
      success:false,
      message:e.message
     })
  }
}
module.exports={
    signup,
    signin,
    getUser,
    logout
}