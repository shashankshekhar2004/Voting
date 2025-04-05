const express = require('express');
const { createPoll } = require('../controllers/pollController');
const router = express.Router();

router.post('/createpoll/:createdBy',createPoll);


module.exports = router;