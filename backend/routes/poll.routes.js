const express = require('express');
const { createPoll, castVote, getYourPolls, deletePoll ,editYourPoll} = require('../controllers/pollController');

const { allPolls,allowedToVote } = require('../controllers/pollController');
const authenticateToken = require('../middleware/auth');
const router = express.Router();
router.post('/createpoll/:createdBy',authenticateToken,  createPoll);
router.post('/allpolls',authenticateToken,allPolls);
router.post('/allowedtovote/:userId',authenticateToken, allowedToVote  );
router.post('/getyourpolls/:userId',authenticateToken,  getYourPolls );
router.delete('/deleteyourpoll/:userId',authenticateToken,  deletePoll );
router.put('/edityourpoll/:pollId', authenticateToken, editYourPoll );


router.post('/castvote/:id',authenticateToken,castVote );


module.exports = router;