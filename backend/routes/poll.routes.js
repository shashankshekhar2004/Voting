const express = require('express');
const { createPoll, castVote } = require('../controllers/pollController');

const { allPolls,allowedToVote } = require('../controllers/pollController');
const authenticateToken = require('../middleware/auth');
const router = express.Router();


router.post('/createpoll/:createdBy', authenticateToken, createPoll);
router.post('/allpolls',authenticateToken,allPolls);
router.post('/allowedtovote/:userId',authenticateToken, allowedToVote  );

router.post('/castvote/:id',castVote );


module.exports = router;