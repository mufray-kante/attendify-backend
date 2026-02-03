const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ---------------- REGISTER USER ---------------- */
exports.registerUser = async (req, res) => {
    try {
        const { fullName, email, password, role, regNumber, staffNumber, universityId } = req.body;

        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ message: "Full name, email, password, and role are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const passwordHash = await bcrypt.hash(password, 10);

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

        return res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("REGISTER USER ERROR:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

/* ---------------- LOGIN USER ---------------- */
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }
        );

        return res.status(200).json({
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
        console.error("LOGIN USER ERROR:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
