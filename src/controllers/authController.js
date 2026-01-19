// backend/src/controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ---------------- REGISTER USER ---------------- */
exports.registerUser = async (req, res) => {
    try {
        const { fullName, email, password, role, regNumber, staffNumber, universityId } = req.body;

        // Ensure mandatory fields
        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ message: "Full name, email, password, and role are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullName,
            email,
            passwordHash,
            role,
            regNumber: regNumber || null,
            staffNumber: staffNumber || null,
            universityId: universityId || null
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

/* ---------------- LOGIN USER ---------------- */
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for empty input
        if (!email || !password) return res.status(400).json({ message: "Email and password required" });

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        // Verify password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        // Sign JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }
        );

        // Return token + user info
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
