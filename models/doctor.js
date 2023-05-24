const mongoose = require("mongoose");
const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    qualification: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    licenseNumber: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        enum: ['Orthopedics', 'Pediatrics', 'Dental', 'Surgery', 'Nutrition', 'Dermatology'],
        required: true,
    }
});



const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;