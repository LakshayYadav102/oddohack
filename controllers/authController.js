const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // 🔐 Immediately generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    // 🎯 Return token and user data
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({
  token,
  user: {
    _id: user._id,
    name: user.name,
    isAdmin: user.isAdmin, // ✅ include this
  },
});
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
// Fetch public profiles (with search & pagination)
// controllers/authController.js

exports.getPublicProfiles = async (req, res) => {
  try {
    const { page = 1, limit = 6, availability, skill } = req.query;

    const query = {
      isPublic: true,
      isBanned: { $ne: true }, // ✅ exclude banned users
    };

    if (availability) {
      query.availability = availability;
    }

    if (skill) {
      query.$or = [
        { skillsOffered: { $regex: skill, $options: 'i' } },
        { skillsWanted: { $regex: skill, $options: 'i' } },
      ];
    }

    const profiles = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      profiles,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// Get logged-in user's profile
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update logged-in user's profile
exports.updateMyProfile = async (req, res) => {
  try {
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.user, updates, {
      new: true,
    }).select('-password');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user || !user.isPublic || user.isBanned) {
      return res.status(404).json({ msg: 'User not found or unavailable' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};