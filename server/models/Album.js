const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  clubId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  name:       { type: String, required: true },
  visibility: { type: String, enum: ['Public', 'Members Only'], default: 'Members Only' },
  photos:     [{ url: String, name: String, seed: Number }],
}, { timestamps: true });

module.exports = mongoose.model('Album', albumSchema);
