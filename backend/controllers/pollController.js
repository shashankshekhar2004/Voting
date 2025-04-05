const pollModel = require('../models/voting');
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
const allPolls=async(req,res)=>{
    try{
        const polls = await pollModel.find();
        return res.status(200).json({polls});


    }
 catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to caste vote' });
}
}








// const castVote=async(req,res)=>{
//     try{
//         const {id}=req.params;
//         const {pollId}=req.body;


//     }
//  catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Failed to caste vote' });
// }
// }

module.exports = { createPoll ,allPolls}