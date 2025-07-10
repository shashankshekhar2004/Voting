const UserModel = require('../models/user')
const bcrypt = require('bcrypt')
const OtpModel = require('../models/otp')
const jwt = require('jsonwebtoken')
const register = async (req, res) => {
    try {
        const { name, password, email, otp } = req.body;
        if (!name || !password || !email) {
            return res.send({
                success:false,
                status: 400,
                message: "Enter All Fields"
            })
        }
        const isValidEmail = await UserModel.findOne({ email });
        if (isValidEmail) {
            return res.send({
                success:false,
                status: 401,
                message: "Already Registered Try Logging in"
            })
        }
        const isValidOtp = await OtpModel.findOne({ email });
        if (!isValidOtp) {
            return res.send({
                success:false,
                status: 401,
                message: "Invalid OTP"
            })
        }
        if (isValidOtp && isValidOtp.otp != otp) {
            return res.send({
                success:false,
                status: 401,
                message: "Invalid OTP"
            })
        }



        const hashPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({
            name: name,
            password: hashPassword,
            email: email,
        })
        await user.save()
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: "2d" }
        );


        await OtpModel.deleteOne({ email });

        return res.send({
            success:true,
            status: 200,
            message: "User Registered Successfully",
            token: token,
            id: user._id
        })

    } catch (error) {
        console.log(error)
    }
}
const login = async (req, res) => {
    try {
        const { password, email, otp } = req.body;
        if (!password || !email || !otp) {

            return res.send({
                status: 400,
                success:false,
                message: "Enter All Fields"
            })
        }

        const isValidEmail = await UserModel.findOne({ email });
        if (!isValidEmail) {
            return res.send({
                success:false,
                status: 401,
                message: "User Not Found"
            })

        }
        const isValidOtp = await OtpModel.findOne({ email });
        if (!isValidOtp) {
            return res.send({
                success:false,
                status: 401,
                message: "Invalid OTP"
            })
        }
        if (isValidOtp && isValidOtp.otp != otp) {
            return res.send({
                success:false,
                status: 401,
                message: "Invalid OTP"
            })
        }
        const user = await UserModel.findOne({ email });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send({
                success:false,
                status: 401,
                message: "Invalid credentials"
            })
        }
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: "2d" }
        );


        await OtpModel.deleteOne({ email });

        return res.send({
            status: 200,
            success: true,
            message: "User logged in Successfully",
            token: token,
            id: user._id
        })


    } catch (error) {
        console.log(error)
    }
}

module.exports = { register, login };