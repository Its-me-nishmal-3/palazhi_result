
const Mark = require('../models/Mark');

// @desc    Get all marks for a specific exam
// @route   GET /api/marks/exam/:examId
// @access  Private
const getMarksByExam = async (req, res) => {
    try {
        const marks = await Mark.find({ examId: req.params.examId });
        res.json(marks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create or update a mark
// @route   POST /api/marks
// @access  Private
const upsertMark = async (req, res) => {
    const { studentId, examId, subjectId, marks } = req.body;
    try {
        const filter = { studentId, examId, subjectId };
        const update = { marks };
        const options = { new: true, upsert: true };

        const savedMark = await Mark.findOneAndUpdate(filter, update, options);
        res.status(201).json(savedMark);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid data' });
    }
};


module.exports = {
    getMarksByExam,
    upsertMark,
};
