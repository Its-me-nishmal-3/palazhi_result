
const express = require('express');
const router = express.Router();
const { upsertMark, getMarksByExam } = require('../controllers/markController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, upsertMark);
router.route('/exam/:examId').get(protect, getMarksByExam);

module.exports = router;
