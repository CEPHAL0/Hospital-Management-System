const express = require('express')
const mongoose = require("mongoose");
const patientsRouter = require("./routes/patients");
const userRouter = require('./routes/users');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost/hospital', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Failed to connect to MongoDB", error);
});

// Middleware for parsing and URL encoding
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Routes for patients
app.use('/api/patients', patientsRouter);

// Routes for users
app.use('/api/users', userRouter);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});