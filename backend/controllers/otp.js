
const otpModel = require('../models/otp')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


const sendOtpHandler = async (req, res) => {
  const { token } = req.body;
  var email = req.body.email;

  const otp = Math.floor(1000 + Math.random() * 9000);

  if (!email) {
    try {
      console.log("here")
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      email = decoded.email;
    } catch (error) {
      return res.send({ success: false, message: "Invalid token" });
    }
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'princeshashank034037@gmail.com',
        pass: process.env.smtp,
      },
    });

    const mailOptions = {
      from: 'princeshashank034037@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Hi! Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).send({ success: false, message: 'Failed to send OTP' });
      } else {
        console.log('OTP sent:', otp, info.response);

        await otpModel.deleteOne({ email }); // Clean up any old OTP
        const otpObject = new otpModel({ email, otp });
        await otpObject.save();

        return res.send({
          status: 1,
          success: true,
          message: 'OTP sent via Gmail and saved',
        });
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};



module.exports = sendOtpHandler;