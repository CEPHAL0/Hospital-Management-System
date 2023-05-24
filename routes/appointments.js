const express = require("express");
const router = express.Router();
const Appointment = require('../models/appointment');
const auth = require("../middleware/auth");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");


// Create an appointment
router.post('/', auth, async (req, res) => {
    try {
        const { doctorId, patientId, reason } = req.body;
        const { _id: userId, username: username } = req.user;

        const [doctor, patient] = await Promise.all([
            Doctor.findById(doctorId),
            Patient.findById(patientId)
        ])

        if (!doctor || !patient) {
            return res.status(404).json({ message: "Doctor or patient not found" });
        }

        const appointment = new Appointment({
            doctor: doctorId,
            patient: patientId,
            user: userId,
            reason: reason,
        });

        await appointment.save();

        return res.status(201).json({
            message: "Appointment Created Successfully",
            appointment: {
                _id: appointment._id,
                doctorId: appointment.doctor,
                patientId: appointment.patient,
                userId: appointment.user,
                doctorName: doctor.name, // Retrieve the doctor name using doctorId
                patientName: patient.name, // Retrieve the patient name using patientId
                username: username,
                date: appointment.date,
                reason: appointment.reason,
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to Create appointment", error: error.message })
    }
});

module.exports = router;