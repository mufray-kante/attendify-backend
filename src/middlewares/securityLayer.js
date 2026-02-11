const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL, // Production frontend
];

exports.globalSecurity = (app) => {
    // Security headers
    app.use(helmet());

    // CORS
    app.use(
        cors({
            origin: (origin, callback) => {
                // Allow Postman, curl, server-to-server
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

    // Handle preflight properly
    app.options("*", cors());

    // General API rate limiter
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 200,
        standardHeaders: true,
        legacyHeaders: false,
    });

    app.use("/api", apiLimiter);
};

exports.loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many login attempts. Try again later.",
});