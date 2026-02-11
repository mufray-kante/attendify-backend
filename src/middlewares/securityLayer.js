const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

// Allowed origins: localhost for dev + production frontend from env
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL, // Production frontend URL
];

exports.globalSecurity = (app) => {
    // ✅ Security headers
    app.use(helmet());

    // ✅ CORS
    app.use(
        cors({
            origin: (origin, callback) => {
                // Allow server-to-server, Postman, curl, etc.
                if (!origin) return callback(null, true);

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

    // ✅ Preflight requests are automatically handled by cors()

    // ✅ General API rate limiter (15 min window)
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 200,
        standardHeaders: true,
        legacyHeaders: false,
    });

    app.use("/api", apiLimiter);
};

// ✅ Login-specific rate limiter
exports.loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many login attempts. Try again later.",
});