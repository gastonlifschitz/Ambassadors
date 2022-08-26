const mongoose = require('mongoose');
const {
    Schema
} = mongoose;
const userSchema = require('./userSchema');

const unsubscriberSchema = new Schema({
    user: {
        type: userSchema,
        required: true
    },
    motive: {
        type: String,
        required: true
    },
    timestamp: { type: Date, default: Date.now },
}, );

module.exports = mongoose.model('Unsubscriber', unsubscriberSchema);