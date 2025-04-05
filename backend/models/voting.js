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
    ImageUrl:{
        type:String,
    },
    voters:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
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
        default: false
    },
    allowedRollRange: {
        from: { type: String },  // e.g. 2021BCS001
        to: { type: String }
    }
    
    
}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);