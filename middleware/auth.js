const jwt = require("jsonwebtoken");
const User = require("../models/user");
const dotenv = require("dotenv")
dotenv.config();

// Middleware to authenticate the JWT Token and authorize appointments
const auth = async (req, res, next) => {
    try {
        // Get the token from the request header
        const token = req.header("Authorization").replace("Bearer", "").trim();
        if (!token) {
            throw new Error("No token provided");
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            throw new Error("Invalid token");
        }

        // Find the user based on the token payload
        const user = await User.findById(decoded.userId)
        console.log("Decoded _id:", decoded.userId);
        console.log("Token:", token);

        if (!user) {
            throw new Error("User not found");
        }

        // Attach the user and token to the request object
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ message: "Authentication Failed", error: error.message });
    }
}

module.exports = auth;