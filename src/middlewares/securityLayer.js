const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

// Only include valid URLs
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
].filter(Boolean);

exports.globalSecurity = (app) => {
    // Security headers
    app.use(helmet());

    // CORS
    app.use(
        cors({
            origin: (origin, callback) => {
                // Allow server-to-server or Postman
                if (!origin) return callback(null, true);

                if (allowedOrigins.includes(origin)) return callback(null, true);

                return callback(new Error("Not allowed by CORS"));
            },
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        })
    );

    // API rate limiter
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200,
        standardHeaders: true,
        legacyHeaders: false,
    });

    app.use("/api", apiLimiter);
};

// Login-specific limiter
exports.loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many login attempts. Try again later.",
});