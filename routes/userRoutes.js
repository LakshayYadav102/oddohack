const express = require('express');
const upload = require('../config/multer');
const router = express.Router();
const User = require('../models/User'); // ✅ Required for photo update

const {
  register,
  login,
  getPublicProfiles,
  getMyProfile,
  updateMyProfile,
  getUserById,
} = require('../controllers/authController');

const authMiddleware = require('../middleware/auth');

// ✅ Register/Login Routes
router.post('/register', register);
router.post('/login', login);

// ✅ Upload Photo
router.post(
  '/upload-photo',
  authMiddleware,
  upload.single('profilePhoto'),
  async (req, res) => {
    try {
      const filePath = req.file.path.replace(/\\/g, '/'); // ✅ Normalize path
      const updated = await User.findByIdAndUpdate(
        req.user,
        { profilePhoto: filePath },
        { new: true }
      ).select('-password');

      res.json({ msg: 'Profile photo uploaded', user: updated });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);

// ✅ Profile Management
router.get('/public', getPublicProfiles);
router.get('/me', authMiddleware, getMyProfile);
router.put('/me', authMiddleware, updateMyProfile);

// ✅ Get another user's public profile by ID
router.get('/:id', getUserById);

module.exports = router;
