const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  club:        { type: String, required: true },
  clubId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  date:        { type: String, required: true },
  time:        { type: String, required: true },
  location:    { type: String, required: true },
  category:    { type: String, default: 'Workshop' },
  status:      { type: String, enum: ['Draft', 'Published', 'Ongoing'], default: 'Draft' },
  capacity:    { type: Number, default: 50 },
  description: String,
  rsvps:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
