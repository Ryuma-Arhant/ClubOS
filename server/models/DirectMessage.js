const mongoose = require('mongoose');

const directMessageSchema = new mongoose.Schema({
  channelId: { type: String, required: true, index: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sender:    { type: String, required: true },
  avatar:    { type: String, required: true },
  text:      { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('DirectMessage', directMessageSchema);
