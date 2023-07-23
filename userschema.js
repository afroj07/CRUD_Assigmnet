const mongoose= require('mongoose');
const JWT = require('jsonwebtoken')
const bcrypt= require('bcrypt');
const {Schema} =mongoose;
 
const userSchema = new Schema({
     name:{
        type:String,
        required:[true, 'user name is Required'],
        minLength:[7, 'Name must be at least 7 char'],
        maxLength:[50, 'Name should be less than 50'],
        trim:true
     },
     email:{
        type:String,
        required:[true, 'user email is Required'],
        unique:true,
        lowercase:true,
        unique:[true, 'already registed'],
        trim:true
     },
     password:{
        type:String,
        select:false,
        required:[true, 'user password is Required'],
     },
     confirmPassword:{
        type:String,
        required:[true,'confirmpassword required'],
        select:false
     },
     forgetPasswordToken:{
        type:String,
        select:false,
     },
     forPasswordExpiryDate:{
        type:Date
     },
});
userSchema.pre('save', async function(next){
   if(!this.isModified('password')){
      return next();
   }
   this.password=await bcrypt.hash(this.password,10);
   return next();
})
userSchema.methods={
   jwtToken(){
      return JWT.sign({
         id: this._id,
         email:this.email},
         process.env.SECRET,
         
         {expiresIn:'24h'}
      )
   }
}

const userModel = mongoose.model('user', userSchema);
module.exports=userModel;