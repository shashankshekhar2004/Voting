const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    createdBy: {  
       type:String,   
       required: true
    },
    pollName: {
        type: String,
        required: true
    },
    candidates: [{
        candidateName: {  
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
    allowedRollNumbers: [{  
        type: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);
