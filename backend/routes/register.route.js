const express = require('express');
const router = express.Router();
const sendOtpHandler=require('../controllers/otp')
const {register,login}=require('../controllers/userController')


router.post('/register',register);
router.post('/sendotp',sendOtpHandler);
router.post('/login',login);



module.exports = router;