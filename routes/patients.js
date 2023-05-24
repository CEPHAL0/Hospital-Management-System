const express = require("express");
const router = express.Router();
const Patient = require("../models/patient");

router.post('/register', async (req, res) => {
    try {
        const { name, age, gender, contactNumber, address, numberOfAppointments } = req.body;

        if (!numberOfAppointments) {
            numberOfAppointments = 0;
        }

        const patient = await Patient.create({ name, age, gender, contactNumber, address, numberOfAppointments });

        res.status(201).json({ message: 'Patient created successfully', patient });
    }
    catch (error) {
        if (error.name == 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            res.status(400).json({ message: "Validation error", errors })
        }
        else {
            res.status(500).json({ message: 'Failed to create patient', error: error.message });
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