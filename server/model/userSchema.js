const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  _id: { type: String, required: true }
}, { _id: false });

userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('uid').get(function() {
  return this._id.toString();
});

userSchema.set('toJSON', { virtuals: true });

module.exports = userSchema;
