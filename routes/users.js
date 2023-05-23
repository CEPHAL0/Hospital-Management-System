const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const path = require('path');
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();


// Error handling middleware
const errorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Handle multer errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File Size Limit Exceeded' });
        }
    } else if (err) {
        // Handle other errors
        return res.status(400).json({ message: err.message });
    }

    next(err);
}

// Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        let uniqueFileName = '';
        if (fileExtension == '.jpg' || fileExtension == '.jpeg' || fileExtension == '.gif' || fileExtension == '.png') {
            uniqueFileName = `${Date.now()}${fileExtension}`;
            req.uniqueFileName = uniqueFileName;
            cb(null, uniqueFileName);
        } else {
            cb(new Error('Invalid file extension'), null);
        }

    }
});

const upload = multer({ storage });


// Register a new user
// upload.single for single file uploads
router.post('/register', upload.single('profilePicture'), async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if creation of a user already exists
        const existingUser = await User.findOne({ username });

        const existingEmail = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }

        if (existingEmail) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const user = new User({ username, email, password });

        if (req.fileValidationError) {
            // Handle the file validation error
            return res.status(400).json({ message: req.fileValidationError });
        }
        // Update the profile picture if it exists
        if (req.file) {
            const uniqueFileName = req.uniqueFileName;
            await user.updateProfilePicture(req.file.path);
        }
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to register user", error: error.message });
        next(error);
    }
});

// Register the error handling middleware
router.use(errorHandler);

// Authenticate user and generate JWT
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        // Checking is the username exists
        if (!user) {
            return res.status(401).json({ message: "Authentication Failed x1" });
        }

        // Checking password
        const isPassWordValid = await user.comparePassword(password);
        if (!isPassWordValid) {
            return res.status(401).json({ message: "Incorrect Password" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Authentication Failed x2", error: error.message })
    }
});

module.exports = router;