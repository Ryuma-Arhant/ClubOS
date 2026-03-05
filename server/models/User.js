const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:    { type: String, required: true },
  role:        { type: String, enum: ['Super Admin', 'Club Admin', 'Co-Admin', 'Student'], default: 'Student' },
  roleVariant: { type: String, default: 'purple' },
  clubId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
