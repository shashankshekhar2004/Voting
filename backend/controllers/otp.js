const nodemailer = require('nodemailer');
const Otp = require('../models/otp');

const sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.create({ email, otp });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP is ${otp}`
  });

  res.json({ message: 'OTP sent to email' });
};


const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
  
    const match = await Otp.findOne({ email, otp });
    if (!match) return res.status(400).json({status:200,success:false, error: 'Invalid or expired OTP' });
  
    await Otp.deleteOne({ email });
    res.json({status:200,success:true,
         message: 'OTP verified. Proceed to register user.' });
  };
  

  module.exports = {
    sendOtp,
    verifyOtp
  };