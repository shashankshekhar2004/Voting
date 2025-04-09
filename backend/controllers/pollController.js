const pollModel = require('../models/voting');
const userModel = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const otpModel=require('../models/otp')
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


const deletePoll = async (req, res) => {
    try {
        const { userId } = req.params;
        const { pollId } = req.body;

        const poll = await pollModel.findById(pollId);
        if (!poll) {
            return res.status(404).json({ error: 'Poll not found.' });
        }

        if (poll.createdBy.toString() !== userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this poll.' });
        }

        await pollModel.findOneAndDelete({ _id: pollId });

        return res.status(200).json({ message: 'Poll deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to delete poll' });
    }
};





const editYourPoll = async (req, res) => {
    try {
        const { pollId, pollData } = req.body;

        // Find the poll
        const poll = await pollModel.findById(pollId);
        if (!poll) {
            return res.status(404).json({ status: false, error: 'Poll not found.' });
        }

        // Check if the user is the creator
        // // if (poll.createdBy.toString() !== userId) {
        //     return res.status(403).json({ status: false, error: 'You are not authorized to edit this poll.' });
        // }

        // Allowed fields to update
        const updatableFields = [
            'pollName',
            'candidatesArray',
            'pollImageUrl',
            'expiryDate',
            'openToAll',
            'allowedRollRange',
            'allowedDomains'
        ];

        // Apply updates safely
        updatableFields.forEach(field => {
            if (pollData[field] !== undefined) {
                poll[field] = pollData[field];
            }
        });

        await poll.save();

        return res.status(200).json({ status: true, message: 'Poll updated successfully.', updatedPoll: poll });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, error: 'Something went wrong while updating the poll.' });
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


    //  Check if user already voted
    const hasVoted = poll.voters.find(voter => voter.voterId.toString() === id);
    if (hasVoted) {
        return res.status(403).json({
            status: 200,
            error: 'You have already voted',
            alreadyVoted: true,
            candidateUUID:hasVoted.votedTo
        });
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







const castVote = async (req, res) => {
    try {
        const { id } = req.params;
        const { pollId, candidateId, otp } = req.body;

        // 1. Find user
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        const email = user.email;

        // 2. Validate OTP
        const isValidOtp = await otpModel.findOne({ email });
        if (!isValidOtp || isValidOtp.otp !== otp) {
            return res.status(401).json({ status: 401, message: "Invalid OTP" });
        }

        // Optionally delete OTP to prevent reuse
        await otpModel.deleteOne({ email });

        // 3. Fetch poll
        const poll = await pollModel.findById(pollId);
        if (!poll) {
            return res.status(404).json({ status: 404, message: "Poll not found" });
        }

        // 4. Check if user already voted
        const hasVoted = poll.voters.find(voter => voter.voterId.toString() === id);
        if (hasVoted) {
            return res.status(403).json({
                status: 403,
                message: "You have already voted",
                alreadyVoted: true,
                candidateUUID: hasVoted.votedTo
            });
        }

        // 5. Find candidate
        const candidate = poll.candidatesArray.find(c => c.candidateId === candidateId);
        if (!candidate) {
            return res.status(404).json({ status: 404, message: "Candidate not found" });
        }

        // 6. Increment vote
        candidate.votes += 1;
        poll.totalVotes += 1;

        // 7. Add to voters list
        poll.voters.push({ voterId: id, votedTo: candidateId });

        // 8. Save poll
        await poll.save();

        return res.status(200).json({
            status: 200,
            message: `Vote casted successfully for ${candidate.candidateName}`,
            votes: candidate.votes,
            totalVotes: poll.totalVotes
        });

    } catch (error) {
        console.error("Error while casting vote:", error);
        return res.status(500).json({ status: 500, message: "Failed to cast vote" });
    }
};

const getYourPolls=async(req,res)=>{
    try{
        const {userId}=req.params;
        if(!userId){
            return res.status(400).json({status:400,message:"User ID is required"});
        }
        const polls=await pollModel.find({createdBy:userId});
        return res.send({status:200,polls});
        
    }
    catch(error){
        console.error("Error while getting your polls:", error);
    }
}



module.exports = { createPoll, allPolls, allowedToVote,castVote,getYourPolls,deletePoll,editYourPoll }