const express = require("express");
const router = express.Router();
const Patient = require("../models/patient");
const multer = require("multer");


// Making an instance of multer to properly encode the input form data
const upload = multer();

// Create new Patients
router.post('/register', upload.none(), async (req, res) => {
    try {
        const { name, age, gender, contactNumber, address, numberOfAppointments } = req.body;

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


// Get all Patients Details
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json({ patients: patients });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve patients', error })
    }
});

// Get Patient by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findById(id);

        if (!patient) {
            return res.status(404).json({ message: "Patient Not Found" });
        }

        res.status(200).json(patient)
    } catch (error) {
        res.status(500).json({ message: 'Failed to Retrieve Patient', error: error.message })
    }
})


// Update Patient
// Using multer middleware to parse form data
router.put('/update/:id', upload.none(), async (req, res) => {
    try {
        const { name, age, address, numberOfAppointments, contactNumber, gender } = req.body;

        const { id } = req.params;
        const patient = await Patient.findById(id);

        if (!patient) {
            return res.status(404).json({ message: "Patient Not Found" })
        }

        patient.name = name;
        patient.age = age;
        patient.address = address;
        patient.numberOfAppointments = numberOfAppointments;
        patient.contactNumber = contactNumber;
        patient.gender = gender;

        await patient.save();

        return res.status(200).json({ message: "Patient Updated Successfully", updatedPatient: patient });

    } catch (error) {
        return res.status(500).json({ message: "Failed to Update Patient Details", error: error.message })
    }
})


// Deleting user by id
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findById(id);

        if (!patient) {
            return res.status(404).json({ message: "Patient Not Found" });
        }

        await patient.deleteOne();
        return res.status(200).json({ message: "Patient Record Deleted Successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Cannot Delete Patient Details", error: error.message })
    }
})

module.exports = router;