const express = require('express');
const { createPoll } = require('../controllers/pollController');

const { allPolls } = require('../controllers/pollController');
const router = express.Router();


router.post('/createpoll/:createdBy',createPoll);
router.post('/allpolls',allPolls);
//router.post('castvote/:id',castVote);


module.exports = router;