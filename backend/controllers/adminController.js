
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

// Seed Admin User
const seedAdmin = async () => {
    try {
        const adminExists = await Admin.findOne({ username: 'admin' });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'password', salt);
            await Admin.create({
                username: 'admin',
                password: hashedPassword,
            });
            console.log('Admin user created');
        }
    } catch (error) {
        console.error('Error seeding admin user', error);
    }
};

// @desc    Authenticate an admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });

        if (admin && (await bcrypt.compare(password, admin.password))) {
            res.json({
                _id: admin.id,
                username: admin.username,
                token: generateToken(admin._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in admin', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = {
    seedAdmin,
    loginAdmin,
};
