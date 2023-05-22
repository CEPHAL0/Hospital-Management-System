const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,

        // Remove the whitespaces
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,

        // Remove the whitespaces
        trim: true,
        lowercase: true,
        validate: {
            validator: (value) => {

                // In the format example@gmail.com
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
            },
            message: 'Invalid Email Address'
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    }
});


// Hash the password before saving into the database
userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;

        // Inbuilt middleware to perform subsequent operation after password generation
        next();
    }
    catch (error) {
        next(error);
    }
});

// Helper method to compare passwords
userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

const User = mongoose.model('User', userSchema);
module.exports = User;