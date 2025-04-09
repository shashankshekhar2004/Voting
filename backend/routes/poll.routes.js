const express = require('express');
const { createPoll, castVote, getYourPolls, deletePoll ,editYourPoll} = require('../controllers/pollController');

const { allPolls,allowedToVote } = require('../controllers/pollController');
const authenticateToken = require('../middleware/auth');
const router = express.Router();
router.post('/createpoll/:createdBy',  createPoll);
router.post('/allpolls',authenticateToken,allPolls);
router.post('/allowedtovote/:userId',authenticateToken, allowedToVote  );
router.post('/getyourpolls/:userId',  getYourPolls );
router.post('/deleteyourpoll/:userId',  deletePoll );
router.post('/edityourpoll/:userId',  editYourPoll );

router.post('/castvote/:id',castVote );


module.exports = router;