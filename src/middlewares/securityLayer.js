// src/middlewares/securityLayer.js
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

/* ================= GLOBAL SECURITY ================= */
exports.globalSecurity = (app) => {
    // Secure HTTP headers
    app.use(helmet());

    // CORS (local + production)
    app.use(
        cors({
            origin: [
                "http://localhost:5173",
                "https://attendify-frontend-nine.vercel.app"
            ],
            credentials: true
        })
    );

    // Global API rate limiting
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 200,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            message: "Too many requests. Please try again later."
        }
    });

    app.use("/api", apiLimiter);
};

/* ================= LOGIN RATE LIMIT ================= */
exports.loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many login attempts. Try again later."
    }
});
