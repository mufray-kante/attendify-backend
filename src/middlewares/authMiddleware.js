const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Make sure you have a User model

// Protect routes and attach full user info
exports.protect = async (req, res, next) => {
    try {
        const authHeader = req.headers?.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from DB
        const user = await User.findById(decoded.id).select("-passwordHash");
        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = user; // attach full user info
        next();
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        return res.status(401).json({ message: "Invalid token" });
    }
};

// Role-based access
exports.requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: "Not authenticated" });
        if (req.user.role !== role) return res.status(403).json({ message: "Access denied" });
        next();
    };
};
