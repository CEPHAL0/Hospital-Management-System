const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

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
    },

    profilePicture: {
        type: String,
        default: "uploads/default.jpg"
    }
});


// Hash the password before saving into the database
userSchema.pre('save', async function (next) {
    try {
        
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
        console.log(this.password)
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

// Helper method to update profile picture
userSchema.methods.updateProfilePicture = async function (filePath) {
    try {
        // Delete previous picture if exists
        const previousPicturePath = path.join(__dirname, '..', 'uploads', this.profilePicture);
        if (fs.existsSync(previousPicturePath)) {
            fs.unlinkSync(previousPicturePath);
        }

        // Generate a unique filename for profile picture
        const fileExtension = path.extname(filePath);
        const uniqueFileName = `${this._id}${fileExtension}`;
        const newPicturePath = path.join(__dirname, "..", "uploads", uniqueFileName);

        // Move the uploaded picture to the new location
        fs.renameSync(filePath, newPicturePath);

        // Update the profilePicture field in the user document
        this.profilePicture = uniqueFileName;
        await this.save();

        return uniqueFileName;

    } catch (error) {
        throw new Error(error);
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;