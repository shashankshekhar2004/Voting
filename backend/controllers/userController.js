const UserModel =require('../models/user') 
const bcrypt = require('bcrypt')

export const register =async (req,res)=>{
    try {
        const {name, password, email, fingerprint} = req.body;
        if(!name || !password || !email || !fingerprint){
            res.send({
                status:400,
                message:"Enter All Fields"
            })
        }
        const isValidEmail = await UserModel.findOne({ email });
        if(isValidEmail){
            res.send({
                status:401,
                message:"Already Registered Try Logging in"
            })
        }
        

        const hashPassword=await bcrypt.hash(password,10);
        const user=new UserModel ({
            name:name,
            password:hashPassword,
            email:email,
        })


    } catch (error) {
        console.log(error)
    }
}