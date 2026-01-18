const jwt = require("jsonwebtoken");

/**
 * Middleware to protect routes
 * Checks for a valid JWT in Authorization header
 */
exports.protect = (req, res, next) => {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user info to req
        next();
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        return res.status(401).json({ message: "Invalid token" });
    }
};

/**
 * Middleware to restrict access based on user role
 * @param {string} role - required role to access the route
 */
exports.requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        if (req.user.role !== role) {
            return res.status(403).json({ message: "Access denied" });
        }

        next();
    };
};
