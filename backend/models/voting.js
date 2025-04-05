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
            required: true
        },
        description: {
            type: String,
            required: true
        },
        votes: {
            type: Number,
            default: 0
        },
        candiadateImageUrl: {
            type: String,
            default: "candidate image"
        }
    }],
    pollImageUrl: {
        type: String,
        default: "Nit Jsr Image"
    },
    voters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
        from: { type: String },
        to: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);