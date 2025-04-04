const UserModel =require('../models/user') 
const bcrypt = require('bcrypt')
const OtpModel=require('../models/otp')
const register =async (req,res)=>{
    try {
        const {name, password, email, fingerprint,otp} = req.body;
        if(!name || !password || !email){
            return res.send({
                status:400,
                message:"Enter All Fields"
            })
        }
        const isValidEmail = await UserModel.findOne({ email });
        if(isValidEmail){
            return res.send({
                status:401,
                message:"Already Registered Try Logging in"
            })
        }
        const isValidOtp =await OtpModel.findOne({email});
        if(!isValidOtp){
             return res.send({
                status:401,
                message:"Invalid OTP"
            })
        }
        if(isValidOtp && isValidOtp.otp!=otp){
             return res.send({
                status:401,
                message:"Invalid OTP"
            })
        }      

          

        const hashPassword=await bcrypt.hash(password,10);
        const user=new UserModel ({
            name:name,
            password:hashPassword,
            email:email,
        })
        await user.save()
        await OtpModel.deleteOne({email});

        return res.send({
            status:200,
            message:"User Registered Successfully"
        })


    } catch (error) {
        console.log(error)
    }
}

module.exports = {register};