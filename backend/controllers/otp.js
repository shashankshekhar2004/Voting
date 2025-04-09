const { Resend } = require('resend');
const resend = new Resend(process.env.OTP_API);
const otpModel = require('../models/otp')
const axios = require('axios');
const nodemailer = require('nodemailer');


const sendOtpHandler = async (req, res, next) => {
  const { email } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'princeshashank034037@gmail.com',
        pass: process.env.smtp, // Use Gmail App Password if 2FA is enabled
      },
    });


    // Email options
    const mailOptions = {
      from: 'princeshashank034037@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text:`Hi! Your OTP is: ${otp}`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP:', error);
      } else {
        console.log('OTP sent:',otp, info.response);
         res.send({
          status: 1,
          success: true,
          message: 'OTP sent via Gmail',
        })
      }
    });
    const otpObject=new otpModel({email:email,otp:otp});
    await otpObject.save();
    return res.send({message:"otp saved"})
    
  } catch (error) {
    console.log(error)
  }
}


module.exports = sendOtpHandler;