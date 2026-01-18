const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        return res.status(401).json({ message: "Invalid token" });
    }
};

exports.requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: "Not authenticated" });
        if (req.user.role !== role) return res.status(403).json({ message: "Access denied" });
        next();
    };
};
