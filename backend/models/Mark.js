
const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
    studentId: { // This refers to the custom, auto-incremented student ID
        type: Number,
        ref: 'Student',
        required: true,
    },
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true,
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    marks: {
        type: Number,
        min: 0,
        max: 100,
        default: null
    },
});

// Composite unique key to prevent duplicate marks
markSchema.index({ studentId: 1, examId: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.model('Mark', markSchema);
