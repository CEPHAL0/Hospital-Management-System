const express = require('express')
const mongoose = require("mongoose");
const patientsRouter = require("./routes/patients");

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost/hospital', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Failed to connect to MongoDB", error);
});

// Routes
app.use('/api/patients', patientsRouter);

// Start server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});