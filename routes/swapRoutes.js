const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); 

const {
  createSwap,
  getMySwaps,
  updateSwapStatus,
  deleteSwap,
  rateUser 
} = require('../controllers/swapController');


router.post('/', authMiddleware, createSwap);               
router.get('/', authMiddleware, getMySwaps);                
router.put('/:id', authMiddleware, updateSwapStatus);       
router.delete('/:id', authMiddleware, deleteSwap);          
router.post('/rate', authMiddleware, rateUser);             

module.exports = router;
