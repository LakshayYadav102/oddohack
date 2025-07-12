const Swap = require('../models/Swap');
const User = require('../models/User');

// Create swap request
exports.createSwap = async (req, res) => {
  try {
    const { toUser, offeredSkill, requestedSkill, message } = req.body;

    const newSwap = new Swap({
      fromUser: req.user,
      toUser,
      offeredSkill,
      requestedSkill,
      message
    });

    await newSwap.save();
    res.status(201).json({ msg: 'Swap request sent', swap: newSwap });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get my incoming and outgoing swaps
exports.getMySwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ fromUser: req.user }, { toUser: req.user }]
    })
    .populate('fromUser', 'name profilePhoto')
    .populate('toUser', 'name profilePhoto');

    res.json({ swaps, userId: req.user }); // <-- include userId
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// Accept/Reject a swap
exports.updateSwapStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const swap = await Swap.findById(id);
    if (!swap || swap.toUser.toString() !== req.user) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    swap.status = status;
    await swap.save();
    res.json({ msg: `Swap ${status.toLowerCase()}` });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete a pending swap (outgoing)
exports.deleteSwap = async (req, res) => {
  try {
    const { id } = req.params;

    const swap = await Swap.findById(id);
    if (!swap || swap.fromUser.toString() !== req.user || swap.status !== 'Pending') {
      return res.status(403).json({ msg: "Not allowed to delete" });
    }

    await Swap.findByIdAndDelete(id);
    res.json({ msg: "Swap deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.rateUser = async (req, res) => {
  const { swapId, rating } = req.body;

  try {
    const swap = await Swap.findById(swapId).populate('toUser');
    if (!swap || swap.rated || swap.status !== 'Accepted') {
      return res.status(400).json({ msg: 'Invalid or already rated swap' });
    }

    const user = await User.findById(swap.toUser._id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Initialize ratingCount if not exists
    user.ratingCount = user.ratingCount || 0;

    user.rating = ((user.rating * user.ratingCount) + rating) / (user.ratingCount + 1);
    user.ratingCount += 1;

    await user.save();

    swap.rated = true;
    swap.ratingGiven = rating;
    await swap.save();

    res.json({ msg: 'Rating submitted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};