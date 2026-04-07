const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sender: { type: String, required: true },
  avatar: { type: String, required: true },
  text:   { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
