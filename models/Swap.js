const mongoose = require('mongoose');

const swapSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offeredSkill: { type: String, required: true },
  requestedSkill: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  rated: { type: Boolean, default: false },
  ratingGiven: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Swap', swapSchema);
