
const Exam = require('../models/Exam');
const Mark = require('../models/Mark');

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
const getExams = async (req, res) => {
    try {
        const exams = await Exam.find({}).sort({ date: -1 });
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create an exam
// @route   POST /api/exams
// @access  Private
const createExam = async (req, res) => {
    const { name, date, classId } = req.body;
    try {
        const newExam = new Exam({ name, date, classId, isPublished: false });
        const savedExam = await newExam.save();
        res.status(201).json(savedExam);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

// @desc    Update an exam
// @route   PUT /api/exams/:id
// @access  Private
const updateExam = async (req, res) => {
    const { name, date, isPublished } = req.body;
    try {
        const exam = await Exam.findById(req.params.id);
        if (exam) {
            exam.name = name ?? exam.name;
            exam.date = date ?? exam.date;
            exam.isPublished = isPublished ?? exam.isPublished;
            const updatedExam = await exam.save();
            res.json(updatedExam);
        } else {
            res.status(404).json({ message: 'Exam not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

// @desc    Delete an exam
// @route   DELETE /api/exams/:id
// @access  Private
const deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (exam) {
            await Mark.deleteMany({ examId: req.params.id });
            await Exam.deleteOne({ _id: req.params.id });
            res.json({ message: 'Exam and associated marks removed' });
        } else {
            res.status(404).json({ message: 'Exam not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getExams,
    createExam,
    updateExam,
    deleteExam,
};
