const { Resend } = require('resend');
const resend = new Resend(process.env.OTP_API);
const otpModel=require('../models/otp')
const axios = require('axios');
// const sendOtpHandler = async (req, res,next) => {
//   const { email } = req.body;

//   const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP

//   try {
//     const result= await resend.emails.send({
//       from: 'onboarding@resend.dev',
//       // console.log(email),
//       // from: 'Acme <onboarding@resend.dev>',
//       to: email,
//       subject: 'Your OTP Code',
//       text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
//     });
//     console.log(`OTP for ${email}: ${otp}`);
//     console.log(result)
//     // Optionally store OTP in DB or in-memory store like Redis
//     const isEmailPresent = await otpModel.findOne({ email: email });
//       if (isEmailPresent) {
//         isEmailPresent.otp = otp;
//         await isEmailPresent.save();
//     }
//     else{
//         const otpData = new otpModel({ email, otp });
//         await otpData.save();
//     }
//     console.log(`OTP for ${email}: ${otp}`);

//     res.status(200).json({status:1,success:true, message: 'OTP sent to your email' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to send OTP' });
//   }
//   next();
// };




const sendOtpHandler = async (req, res, next) => {
  const { email } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP

  try {
    const response = await axios.post('https://api.postmarkapp.com/email', {
      From: '2022ugcs037@nitjsr.ac.in', 
      To: email,
      Subject: 'Your OTP Code',
      TextBody: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      HtmlBody: `<html><body><p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p></body></html>`,
      MessageStream: 'outbound'
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': process.env.OTP_API 
      }
    });

    console.log(`OTP for ${email}: ${otp}`);
   console.log('Postmark response:', response.data);

    // Save or update OTP in DB
    const isEmailPresent = await otpModel.findOne({ email });
    if (isEmailPresent) {
      isEmailPresent.otp = otp;
      await isEmailPresent.save();
    } else {
      const otpData = new otpModel({ email, otp });
      await otpData.save();
    }

    res.status(200).json({ status: 1, success: true, message: 'OTP sent via Postmark' });
  } catch (error) {
    console.error('Postmark error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to send OTP email' });
  }

  next();
};



module.exports = sendOtpHandler;

