const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String },
  profilePhoto: { type: String },
  skillsOffered: [{ type: String }],
  skillsWanted: [{ type: String }],
  availability: { type: String }, 
  isPublic: { type: Boolean, default: true },
  isBanned: {
  type: Boolean,
  default: false,
},
  isAdmin: { type: Boolean, default: false }, 
  rating: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
