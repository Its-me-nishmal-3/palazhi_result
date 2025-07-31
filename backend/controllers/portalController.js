
const Student = require('../models/Student');
const Class = require('../models/Class');
const Exam = require('../models/Exam');
const Mark = require('../models/Mark');
const Setting = require('../models/Setting');


// @desc    Find a student's result
// @route   POST /api/portal/result
// @access  Public
const findResult = async (req, res) => {
    const { studentId, dob } = req.body;

    try {
        const student = await Student.findOne({ id: studentId, dob: dob });
        if (!student || !student.classId) {
            return res.status(404).json({ message: 'No student found with the given credentials.' });
        }

        const studentClass = await Class.findById(student.classId);
        if (!studentClass) {
            return res.status(404).json({ message: 'Student class data not found.' });
        }

        // Find the most recent PUBLISHED exam for that class
        const latestExam = await Exam.findOne({ classId: student.classId, isPublished: true }).sort({ date: -1 });
        if (!latestExam) {
            return res.status(404).json({ message: 'No published results available for this student.' });
        }

        const marksForExam = await Mark.find({ studentId: student.id, examId: latestExam._id });
        
        let totalMaxMarks = 0;
        let scoredMarks = 0;
        
        const marksDetails = studentClass.subjects.map(subj => {
            const mark = marksForExam.find(m => m.subjectId.toString() === subj._id.toString());
            const currentMarks = mark?.marks ?? null;
            totalMaxMarks += 100; // Assuming each subject is out of 100
            if (currentMarks !== null) {
                scoredMarks += currentMarks;
            }
            return {
                subjectName: subj.name,
                marks: currentMarks
            };
        });

        const allSubjectsGraded = marksDetails.every(m => m.marks !== null);
        const allSubjectsPerfect = allSubjectsGraded && marksDetails.every(m => m.marks === 100);

        const result = {
            student,
            exam: latestExam,
            class: studentClass,
            marks: marksDetails,
            totalMarks: scoredMarks,
            percentage: totalMaxMarks > 0 ? parseFloat(((scoredMarks / totalMaxMarks) * 100).toFixed(2)) : 0,
            allSubjectsPerfect,
        };
        
        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get College Name
// @route   GET /api/portal/college-name
// @access  Public
const getCollegeName = async (req, res) => {
    try {
        let setting = await Setting.findOne({ key: 'collegeName' });
        if (!setting) {
            // Create a default if it doesn't exist
            setting = await Setting.create({ key: 'collegeName', value: 'PM ALIHAJI MEMORIAL THAHFEELUL QURA`N COLLEGE' });
        }
        res.json({ name: setting.value });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Set College Name
// @route   POST /api/portal/college-name
// @access  Private
const setCollegeName = async (req, res) => {
    try {
        const { name } = req.body;
        await Setting.findOneAndUpdate({ key: 'collegeName' }, { value: name }, { upsert: true });
        res.json({ message: 'College name updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Get dashboard stats
// @route   GET /api/portal/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalClasses = await Class.countDocuments();
        const totalExams = await Exam.countDocuments();
        const publishedResults = await Exam.countDocuments({ isPublished: true });
        res.json({ totalStudents, totalClasses, totalExams, publishedResults });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    findResult,
    getCollegeName,
    setCollegeName,
    getDashboardStats,
};
