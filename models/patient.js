const mongoose = require("mongoose");
const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    contactNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    }
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;