const express = require('express');
const RegisterRouter = express.Router();
const sendOtp=require('../controllers/otp')
const {register}=require('../controllers/userController')

RegisterRouter.post('/register',register);
RegisterRouter.post('/sendotp',sendOtp);

module.exports = RegisterRouter;