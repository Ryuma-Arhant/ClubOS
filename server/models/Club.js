const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:   String,
  email:  String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

const clubSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  category:     { type: String, default: 'General' },
  status:       { type: String, enum: ['Active', 'Pending', 'Archived'], default: 'Pending' },
  description:  String,
  department:   String,
  founded:      Number,
  admin:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  applications: [applicationSchema],
  submittedBy:  String,
}, { timestamps: true });

module.exports = mongoose.model('Club', clubSchema);
