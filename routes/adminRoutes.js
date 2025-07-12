// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin'); // ✅ Corrected name
const { getUserSkillsByEmail } = require('../controllers/adminController');

const { getReports, getAllSwaps, sendAnnouncement, rejectSkill, banByEmail } = require('../controllers/adminController');


// ✅ Both are functions
router.use(auth, adminMiddleware);
router.get('/user-skills', getUserSkillsByEmail); // ✅ Add this route
router.get('/reports', getReports);
router.get('/swaps', getAllSwaps);
router.post('/alert', sendAnnouncement);
router.put('/reject-skill', rejectSkill);
router.put('/ban-email', banByEmail);

module.exports = router;
