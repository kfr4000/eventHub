// backend/models/Event.js

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  organizer: {
    type: String,
    required: [true, 'Organizer is required'],
  },
  name: {
    type: String,
    required: [true, 'Event name is required'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
});

module.exports = mongoose.model('Event', eventSchema);