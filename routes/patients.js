const express = require("express");
const router = express.Router();
const Patient = require("../models/patient");

router.post('/', async (req, res) => {
    try {
        const { name, age, gender, contactNumber, address } = req.body;
        const patient = await Patient.create({ name, age, gender, contactNumber, address });
        res.status(201).json({ message: 'Patient created successfully', patient });
    }
    catch (error) {
        if (error.name == 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            res.status(400).json({ message: "Validation error", errors })
        }
        else {
            res.status(500).json({ message: 'Failed to create patient', error });
        }
    }
});

router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve patients', error })
    }
});

module.exports = router;