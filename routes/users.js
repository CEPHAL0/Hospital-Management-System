const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const path = require('path');
const multer = require('multer');
const dotenv = require('dotenv');
const fs = require('fs');
const bcrypt = require('bcrypt');
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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ username, email, password: hashedPassword });

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
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Failed to register user", error: error.message });
        next(error);
    }
});

// Register the error handling middleware
router.use(errorHandler);

// Authenticate user and generate JWT
router.post('/login', upload.none(), async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        // Checking is the username exists
        if (!user) {
            return res.status(401).json({ message: "User doesnt exist" });
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


// Endpoint for updating the user info
router.put('/update/:id', upload.single('profilePicture'), async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;

        // Find the user by ID
        const user = await User.findById(id);

        // If the user doesnot exist return an error
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user properties
        user.username = username;
        user.email = email;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
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

        res.status(200).json({ message: "User Updated Successfully", updatedUser: user })
    } catch (error) {
        res.status(500).json({ message: "Failed to update user", error: error.message });
    }
});

// Deleting a user
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Or you can use destructuring method
        // const {id} = req.params;

        // Find the user by ID
        const user = await User.findById(id);

        // If user doesnot exist throw and error
        if (!user) {
            return res.status(200).json({ message: "User Not Found" })
        }

        // Deleting the users profile picture if it exists
        if (user.profilePicture && user.profilePicture !== 'uploads/default.jpg') {
            const profilePicturePath = path.join(__dirname, '..', 'uploads', user.profilePicture)
            if (fs.existsSync(profilePicturePath)) {
                fs.unlinkSync(profilePicturePath);
            }
        }

        // Delete the user
        await user.deleteOne();

        res.status(200).json({ message: "User Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user", error: error.message })
    }
})


// Get all users
router.get('/', async (req, res) => {
    try {
        // Find all users
        const users = await User.find();

        res.status(200).json({ users })
    } catch (error) {
        res.status(500).json({ message: "Failed to get users", error: error.name })
    }
})

// Get patient details by ID
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Or you can use destructuring method
        // const {id} = req.params;


        const user = await User.findById(id);

        // Check if user doesnot exist
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(500).json({ user })
    } catch (error) {
        res.status(500).json({ message: "Failed to get user details", error: error.message })
    }
})
module.exports = router;