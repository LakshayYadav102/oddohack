const User = require('../models/User');
const Swap = require('../models/Swap');

// Approve or reject skills
exports.rejectSkill = async (req, res) => {
  const { userId, skillType, skillName } = req.body; // skillType: 'offered' or 'wanted'

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (skillType === 'offered') {
      user.skillsOffered = user.skillsOffered.filter(skill => skill !== skillName);
    } else if (skillType === 'wanted') {
      user.skillsWanted = user.skillsWanted.filter(skill => skill !== skillName);
    } else {
      return res.status(400).json({ msg: 'Invalid skill type' });
    }

    await user.save();
    res.json({ msg: 'Skill removed' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// Ban a user
exports.banByEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.isBanned = true;
    await user.save();
    res.json({ msg: 'User banned by email' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



// Get all swaps
exports.getAllSwaps = async (req, res) => {
  const swaps = await Swap.find()
    .populate('fromUser', 'name')
    .populate('toUser', 'name');
  res.json(swaps);
};

// Send announcement (optional DB or just return it)
exports.sendAnnouncement = async (req, res) => {
  const { message } = req.body;
  console.log('[GLOBAL MESSAGE]', message); // Simulate broadcast
  res.json({ msg: 'Announcement sent' });
};

// Generate reports (fake summary)
exports.getReports = async (req, res) => {
  const userCount = await User.countDocuments();
  const swapCount = await Swap.countDocuments();
  const accepted = await Swap.countDocuments({ status: 'Accepted' });
  const rejected = await Swap.countDocuments({ status: 'Rejected' });
  const pending = await Swap.countDocuments({ status: 'Pending' });

  res.json({
    totalUsers: userCount,
    totalSwaps: swapCount,
    accepted,
    rejected,
    pending,
  });
};
exports.getUserSkillsByEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email }).select('skillsOffered skillsWanted _id');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({
      userId: user._id,
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
