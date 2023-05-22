const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');
dotenv.config();

// Register a new user
router.post('/register', async (req, res) => {
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
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to register user", error })
    }
});


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
