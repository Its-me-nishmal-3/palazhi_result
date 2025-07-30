
const express = require('express');
const router = express.Router();
const { findResult, getCollegeName, setCollegeName, getDashboardStats } = require('../controllers/portalController');
const { protect } = require('../middleware/authMiddleware');

router.post('/result', findResult);
router.get('/college-name', getCollegeName);
router.post('/college-name', protect, setCollegeName); // Setting name is protected
router.get('/stats', protect, getDashboardStats); // Getting stats is protected

module.exports = router;
