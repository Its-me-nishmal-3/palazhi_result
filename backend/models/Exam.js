
const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: String, // Storing as ISO string from date input
        required: true,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
});

module.exports = mongoose.model('Exam', examSchema);
