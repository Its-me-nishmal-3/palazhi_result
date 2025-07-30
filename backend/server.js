
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { seedAdmin } = require('./controllers/adminController');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();
// Seed admin user
seedAdmin();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/marks', require('./routes/markRoutes'));
app.use('/api/portal', require('./routes/portalRoutes'));


// --- Deployment ---
// This part is for when you build your React app and want Express to serve it
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '../dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}
// --- End Deployment ---


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
