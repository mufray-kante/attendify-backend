const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL, // Production frontend URL from env
].filter(Boolean); // remove undefined if env not set

exports.globalSecurity = (app) => {
    // Security headers
    app.use(helmet());

    // ✅ CORS middleware
    app.use(
        cors({
            origin: (origin, callback) => {
                // Allow server-to-server requests (Postman, curl)
                if (!origin) return callback(null, true);

                // Check allowed origins
                if (allowedOrigins.includes(origin)) {
                    return callback(null, true);
                }

                return callback(new Error("Not allowed by CORS"));
            },
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        })
    );

    // No need for app.options("*"), cors() handles preflight automatically

    // API rate limiter
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 200,
        standardHeaders: true,
        legacyHeaders: false,
    });

    app.use("/api", apiLimiter);
};

// Login-specific rate limiter
exports.loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many login attempts. Try again later.",
});