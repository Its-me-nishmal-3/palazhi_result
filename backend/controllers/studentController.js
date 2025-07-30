
const Student = require('../models/Student');
const Mark = require('../models/Mark');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res) => {
    try {
        const students = await Student.find({}).sort({ id: 1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a student
// @route   POST /api/students
// @access  Private
const createStudent = async (req, res) => {
    const { name, dob, classId } = req.body;
    
    if (!req.file) {
        return res.status(400).json({ message: 'Profile picture is required' });
    }

    try {
        const newStudent = new Student({
            name,
            dob,
            classId: classId || null,
            profilePictureUrl: req.file.path, // URL from Cloudinary
        });
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Invalid student data' });
    }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = async (req, res) => {
    const { name, dob, classId } = req.body;
    try {
        const student = await Student.findById(req.params.id);

        if (student) {
            student.name = name ?? student.name;
            student.dob = dob ?? student.dob;
            student.classId = classId ?? student.classId;
            
            if (req.file) {
                student.profilePictureUrl = req.file.path; // Update with new image URL
            }

            const updatedStudent = await student.save();
            res.json(updatedStudent);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid student data' });
    }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (student) {
            await Mark.deleteMany({ studentId: student.id });
            await Student.deleteOne({ _id: req.params.id });
            res.json({ message: 'Student removed' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
};
