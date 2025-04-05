const { Resend } = require('resend');
const resend = new Resend(process.env.OTP_API);
const otpModel=require('../models/otp')
const sendOtpHandler = async (req, res,next) => {
  const { email } = req.body;

  const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });
    console.log(`OTP for ${email}: ${otp}`);
    // Optionally store OTP in DB or in-memory store like Redis
    const isEmailPresent = await otpModel.findOne({ email: email });
      if (isEmailPresent) {
        isEmailPresent.otp = otp;
        await isEmailPresent.save();
    }
    else{
        const otpData = new otpModel({ email, otp });
        await otpData.save();
    }
    console.log(`OTP for ${email}: ${otp}`);

    res.status(200).json({status:1,success:true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
  next();
};

module.exports = sendOtpHandler;

