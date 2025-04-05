const express = require('express');
const router = express.Router();
const sendOtp=require('../controllers/otp')
const {register,login}=require('../controllers/userController')


router.post('/register',register);
router.post('/sendotp',sendOtp);
router.post('/login',login);



module.exports = router;