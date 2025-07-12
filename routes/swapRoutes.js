const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // ✅ Rename for consistency

const {
  createSwap,
  getMySwaps,
  updateSwapStatus,
  deleteSwap,
  rateUser // ✅ Import this function if you're using /rate
} = require('../controllers/swapController');

// All routes are protected
router.post('/', authMiddleware, createSwap);               // Send request
router.get('/', authMiddleware, getMySwaps);                // View my requests
router.put('/:id', authMiddleware, updateSwapStatus);       // Accept / Reject
router.delete('/:id', authMiddleware, deleteSwap);          // Delete outgoing
router.post('/rate', authMiddleware, rateUser);             // ✅ Rate user after accepted swap

module.exports = router;
