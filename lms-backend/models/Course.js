const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  price: { type: Number, default: 0 },
  thumbnail: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  lectures: [{
    title: String,
    videoId: String,
    isFree: { type: Boolean, default: false },
    notes: String
  }],

  // The Live Class Schedule
  liveClasses: [{
    title: String,
    date: Date,
    time: String,
    meetingLink: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);