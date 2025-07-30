
const Class = require('../models/Class');
const Student = require('../models/Student');
const Exam = require('../models/Exam');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private
const getClasses = async (req, res) => {
    try {
        const classes = await Class.find({});
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a class
// @route   POST /api/classes
// @access  Private
const createClass = async (req, res) => {
    const { name, subjects = [] } = req.body;
    try {
        const newClass = new Class({ name, subjects });
        const savedClass = await newClass.save();
        res.status(201).json(savedClass);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

// @desc    Update a class
// @route   PUT /api/classes/:id
// @access  Private
const updateClass = async (req, res) => {
    const { name, subjects } = req.body;
    try {
        const classToUpdate = await Class.findById(req.params.id);
        if (classToUpdate) {
            classToUpdate.name = name ?? classToUpdate.name;
            if (subjects) {
                // Ensure subjects have IDs. If not, they're new. Mongoose handles this.
                classToUpdate.subjects = subjects.map(s => ({ name: s.name }));
            }
            const updatedClass = await classToUpdate.save();
            res.json(updatedClass);
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

// @desc    Delete a class
// @route   DELETE /api/classes/:id
// @access  Private
const deleteClass = async (req, res) => {
    try {
        const classToDelete = await Class.findById(req.params.id);
        if (classToDelete) {
            // Unassign students from this class
            await Student.updateMany({ classId: req.params.id }, { $set: { classId: null } });
            // Delete exams associated with this class
            await Exam.deleteMany({ classId: req.params.id });
            // Note: Marks will be orphaned but won't be accessible. A more robust system might clean them up.
            await Class.deleteOne({ _id: req.params.id });
            res.json({ message: 'Class removed' });
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getClasses,
    createClass,
    updateClass,
    deleteClass,
};
