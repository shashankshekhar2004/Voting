const express = require('express');
const RegisterRouter = express.Router();

RegisterRouter.post('/register',register);

module.exports = RegisterRouter;