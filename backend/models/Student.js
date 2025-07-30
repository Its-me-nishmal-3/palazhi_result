const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    profilePictureUrl: {
        type: String,
        required: true,
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        default: null,
    },
});

studentSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastStudent = await mongoose.model('Student').findOne().sort({ id: -1 }).select('id');
        this.id = lastStudent ? lastStudent.id + 1 : 1000;
    }
    next();
});

module.exports = mongoose.model('Student', studentSchema);
