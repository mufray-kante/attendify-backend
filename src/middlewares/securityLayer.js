// src/middlewares/securityLayer.js
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

exports.globalSecurity = (app) => {
    // Secure HTTP headers
    app.use(helmet());

    // CORS
    app.use(
        cors({
            origin: "http://localhost:5173",
            credentials: true
        })
    );

    // Global rate limit
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200,
        message: "Too many requests, try again later"
    });

    app.use("/api", apiLimiter);
};

exports.loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: "Too many login attempts. Try again later."
});
