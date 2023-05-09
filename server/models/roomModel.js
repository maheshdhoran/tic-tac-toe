const mongoose = require('mongoose')

//Defining Room Schema
const roomSchema= new mongoose.Schema({
    roomID: {
        type: String,
        required: true,
        unique: true
    },
    userCount: {
        type: Number,
        required: true
    },
    userIds: {
        type: [String],
        default: []
    }
}, { 
    timestamps: true 
});

//Creating Room Model
const Room= mongoose.model('Room', roomSchema);

module.exports = Room;