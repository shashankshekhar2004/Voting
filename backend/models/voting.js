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
    }
    ,
    voters:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    totalVotes: {
        type: Number,
        default: 0
    },
    expiryDate: {
        type: Date,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);
