const pollModel = require('../models/voting');
const userModel = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const otpModel = require('../models/otp')

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
        // console.log(candidatesArray);


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
       // console.log(poll)
        await poll.save();

        return res.status(201).json({ message: 'Poll created successfully', poll });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create poll' });
    }
};


const allowedToVote = async (req, res) => {
    const { userId } = req.params;
    const { pollId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({ allowedToVote: false, message: 'User not found' });
    }
    // console.log("user founded",user)

    const poll = await pollModel.findById(pollId);
    if (!poll) {
        return res.status(404).json({ allowedToVote: false, message: 'Poll not found' });
    }
   // console.log("poll founded", poll)

    if (poll.expiryDate < new Date()) {
        return res.json({ allowedToVote: false, message: 'Poll has expired' });
    }


    //  Check if user already voted
    const hasVoted = poll.voters.find(voter => voter.voterId.toString() === userId);
    //console.log(hasVoted)
    //console.log(hasVoted.votedTo);
    if (hasVoted) {
        return res.json({
            status: 200,
            message: 'You have already voted',
            allowedToVote: false,
            candidateUUID: hasVoted.votedTo, allowedToVote: false
        });
    }
    //console.log("user has not voted yet")


    if (poll.openToAll === true) {
        return res.send({
            success: true,
            status: 200,
            message: "You are allowed to vote",
            allowedToVote: true,
        });
    }

    const email = user.email;
    const rollNumber = email.split('@')[0]; // Extract roll number
    const domain = email.split('@')[1]; // Extract domain

    // console.log(rollNumber, domain, poll.allowedDomains);

    const allowedRangeFrom = poll.allowedRollRange.from, allowedRangeTo = poll.allowedRollRange.to;

    //console.log(allowedRangeFrom, allowedRangeTo, domain, poll.allowedDomains);

    if (allowedRangeFrom === "*" && "*" === allowedRangeTo && domain === poll.allowedDomains) {
        return res.send({
            success: true,
            status: 200,
            message: "You are allowed to vote",
            allowedToVote: true
        });
    }
    else if (rollNumber >= allowedRangeFrom && rollNumber <= allowedRangeTo && domain === poll.allowedDomains) {
        return res.send({
            success: true,
            status: 200,
            message: "You are allowed to vote",
            allowedToVote: true
        });
    }
    else {
        return res.send({
            success: true,
            status: 200,
            message: "You are not allowed to vote",
            allowedToVote: false
        })
    }

};


const deletePoll = async (req, res) => {
    try {
        const { userId } = req.params;
        const { pollId } = req.body;
       // console.log(userId,pollId)

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
      const { pollId } = req.params;
      const {
        pollName,
        pollImageUrl,
        expiryDate,
        candidatesArray
      } = req.body;
  
      const poll = await pollModel.findById(pollId);
      if (!poll) {
        return res.status(404).json({ error: 'Poll not found' });
      }
  
      // Update poll-level fields
      if (pollName) poll.pollName = pollName;
      if (pollImageUrl) poll.pollImageUrl = pollImageUrl;
      if (expiryDate) poll.expiryDate = expiryDate;
  
      // Update candidates
      if (Array.isArray(candidatesArray)) {
        candidatesArray.forEach(updatedCandidate => {
          const existingCandidate = poll.candidatesArray.find(
            c => c.candidateId === updatedCandidate.candidateId
          );
          if (existingCandidate) {
            if (updatedCandidate.description) {
              existingCandidate.description = updatedCandidate.description;
            }
            if (updatedCandidate.candidateImageUrl) {
              existingCandidate.candidateImageUrl = updatedCandidate.candidateImageUrl;
            }
          }
        });
      }
  
      await poll.save();
      return res.status(200).json({ message: 'Poll updated successfully', poll });
  
    } catch (error) {
      console.error("Error updating poll:", error);
      res.status(500).json({ message: 'Server error while updating poll' });
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



const castVote = async (req, res) => {
    try {
        const { id } = req.params;
        const { pollId, candidateId, otp } = req.body;
        //console.log(otp, pollId, candidateId, id);

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        const email = user.email;

        
        const isValidOtp = await otpModel.findOne({ email });
        if (!isValidOtp || isValidOtp.otp !== otp) {
            return res.status(401).json({ status: 401, message: "Invalid OTP" });
        }

        await otpModel.deleteOne({ email });

      
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

        const candidate = poll.candidatesArray.find(c => c.candidateId === candidateId);
        if (!candidate) {
            return res.status(404).json({ status: 404, message: "Candidate not found" });
        }
        candidate.votes += 1;
        poll.totalVotes += 1;

        poll.voters.push({ voterId: id, votedTo: candidateId });

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

const getYourPolls = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ status: 400, message: "User ID is required" });
        }
        const polls = await pollModel.find({ createdBy: userId });
        return res.send({ status: 200, polls });

    }
    catch (error) {
        console.error("Error while getting your polls:", error);
    }
}



module.exports = { createPoll, allPolls, allowedToVote, castVote, getYourPolls, deletePoll, editYourPoll }