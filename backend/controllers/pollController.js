const pollModel = require('../models/voting');
const userModel = require('../models/user');
const { v4: uuidv4 } = require('uuid');

const createPoll = async (req, res) => {
    try {
        const { createdBy } = req.params;
        const {
            pollName,
            candidatesArray,
            pollImageUrl,
            expiryDate,
            openToAll,
            allowedRange,
            allowedDomains
        } = req.body;


        candidatesArray.forEach(candidate => {
            candidate.candidateId = uuidv4();
        });


        const pollData = {
            createdBy,
            pollName,
            candidatesArray,
            pollImageUrl,
            expiryDate,
            openToAll,
            allowedDomains
        };

        if (!openToAll) {
            pollData.allowedRollRange = allowedRange;
        }

        const poll = new pollModel(pollData);
        await poll.save();

        return res.status(201).json({ message: 'Poll created successfully', poll });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create poll' });
    }
};


const allPolls = async (req, res) => {
    try {
        const polls = await pollModel.find();
        return res.status(200).json({ polls });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to caste vote' });
    }
}


const allowedToVote = async (req, res) => {
    const { userId } = req.params;
    const { pollId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const poll = await pollModel.findById(pollId);
    if (!poll) {
        return res.status(404).json({ error: 'Poll not found' });
    }

    if (poll.expiryDate < new Date()) {
        return res.status(403).json({ error: 'Poll has expired' });
    }

    if (poll.openToAll === true ) {
        return res.send({
            success: true,
            status: 200,
            message: "You are allowed to vote"
        });
    }

    const email = user.email;
    const rollNumber = email.split('@')[0]; // Extract roll number
    const domain = email.split('@')[1]; // Extract domain

    const allowedRangeFrom = poll.allowedRollRange.from, allowedRangeTo = poll.allowedRollRange.to;

    if(allowedRangeFrom === "*" && "*" === allowedRangeTo && domain === poll.allowedDomains){
        return res.send({
            success: true,
            status: 200,
            message: "You are allowed to vote"
        });
    }
    else if( rollNumber >= allowedRangeFrom && rollNumber <= allowedRangeTo && domain === poll.allowedDomains  ){
        return res.send({
            success: true,
            status: 200,
            message: "You are allowed to vote"
        }); 
    } 
    else {
        return res.status(403).json({ error: "You are not in the allowed roll number range" });
    }
};



module.exports = { createPoll, allPolls, allowedToVote };