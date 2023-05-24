const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctor");
const multer = require("multer");


// Making an instance of multer to properly encode the input form data
const upload = multer();

// Create new Doctors
router.post('/register', upload.none(), async (req, res) => {
    try {
        const { name, age, qualification, contactNumber, licenseNumber, department } = req.body;

        const doctor = await Doctor.create({ name, age, qualification, contactNumber, licenseNumber, department });

        res.status(201).json({ message: 'Doctor created successfully', doctor });
    }
    catch (error) {
        if (error.name == 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            res.status(400).json({ message: "Validation error", errors })
        }
        else {
            res.status(500).json({ message: 'Failed to create doctor', error: error.message });
        }
    }
});


// Get all Doctors Details
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json({ doctors: doctors });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve doctors', error })
    }
});

// Get Doctor by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return res.status(404).json({ message: "Doctor Not Found" });
        }

        res.status(200).json(doctor)
    } catch (error) {
        res.status(500).json({ message: 'Failed to Retrieve Doctor', error: error.message })
    }
})


// Update Doctor
// Using multer middleware to parse form data
router.put('/update/:id', upload.none(), async (req, res) => {
    try {
        const { name, age, qualification, contactNumber, licenseNumber, department } = req.body;

        const { id } = req.params;
        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return res.status(404).json({ message: "Doctor Not Found" })
        }

        doctor.name = name;
        doctor.age = age;
        doctor.qualification = qualification;
        doctor.contactNumber = contactNumber;
        doctor.licenseNumber = licenseNumber;
        doctor.department = department;

        await doctor.save();

        return res.status(200).json({ message: "Doctor Updated Successfully", updatedDoctor: doctor });

    } catch (error) {
        return res.status(500).json({ message: "Failed to Update Doctor Details", error: error.message })
    }
})


// Deleting user by id
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return res.status(404).json({ message: "Doctor Not Found" });
        }

        await doctor.deleteOne();
        return res.status(200).json({ message: "Doctor Record Deleted Successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Cannot Delete Doctor Details", error: error.message })
    }
})

module.exports = router;