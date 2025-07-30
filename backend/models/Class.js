
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    subjects: [subjectSchema],
});

module.exports = mongoose.model('Class', classSchema);
