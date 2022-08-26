const mongoose = require('mongoose');
const { Schema } = mongoose;
const userSchema = require('./userSchema');

const subscriberSchema = new Schema({
  user: { type: userSchema, required: true },
  interests: { type: String, required: false },
  skills: { type: String, required: false },
  _id: { type: String, required: true }
}, { _id: false });

module.exports = mongoose.model('Subscriber', subscriberSchema);
