const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    createdBy: {
        type: String,
        required: true
    },
    pollName: {
        type: String,
        required: true
    },
    candidatesArray: [{
        candidateName: {
            type: String,
            required: true
        },
        candidateId: {
            type: String,
            // required: true
        },
        description: {
            type: String,
            required: true
        },
        votes: {
            type: Number,
            default: 0
        },
        candidateImageUrl: {
            type: String,default:"https://res.cloudinary.com/daj5o8tyu/image/upload/v1744885246/polls/1744885247881-person.jpg"
        }
    }],
    pollImageUrl: {
        type: String,
        default: "https://res.cloudinary.com/daj5o8tyu/image/upload/v1744885245/polls/1744885244855-poll.jpg"
    },
    voters: [{
        voterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        },
        votedTo:{
            type: String,
            required: true
        }

    }],
    totalVotes: {
        type: Number,
        default: 0
    },
    expiryDate: {
        type: Date,
        required: true
    },
    openToAll: {
        type: Boolean,
        default: true,
        required: true
    },
    allowedRollRange: {
        from: { type: String,default:"*" },
        to: { type: String ,default:"*"}
    },
    allowedDomains: {
        type: String,
        default: "*"
    },
}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);