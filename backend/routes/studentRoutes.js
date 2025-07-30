
const express = require('express');
const router = express.Router();
const { getStudents, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');

router.route('/')
    .get(protect, getStudents)
    .post(protect, upload.single('profilePicture'), createStudent);

router.route('/:id')
    .put(protect, upload.single('profilePicture'), updateStudent)
    .delete(protect, deleteStudent);

module.exports = router;
