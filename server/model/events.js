const mongoose = require('mongoose');
const {
  Schema
} = mongoose;
const userSchema = require('./userSchema');

const speakerSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

const locationSchema = new Schema({
  institution: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: false
  }
});

speakerSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

speakerSchema.set('toJSON', {
  virtuals: true
});


const assistantSchema = new Schema({
  expected: {
    type: Number,
    required: true,
    min: 1
  },
  actual: {
    type: Number,
    min: 0
  }
});

const notificationSchema = new Schema({
  tag: {
    type: String,
    enum: ['creation', 'edit', 'revision', 'approval', 'completion', 'completionReminder', 'cancellation'],
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  author: {
    type: userSchema
  },
  description: {
    type: String
  }
});

const eventSchema = new Schema({
  state: {
    type: String,
    enum: ['scheduled', 'approved', 'completed', 'cancelled'],
    required: true,
    default: 'scheduled'
  },
  location: {
    type: locationSchema,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: userSchema,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    default: 'Otro',
    required: true
  },
  assistants: {
    type: assistantSchema,
    required: true
  },
  notifications: {
    type: [notificationSchema]
  },
  feedback: {
    type: String
  },
  speakers: {
    type: [speakerSchema]
  }
}, {
  usePushEach: true
});

eventSchema.set('toJSON', {
  transform: true,
  virtuals: true
});
module.exports = mongoose.model('Event', eventSchema);