const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

const allowedOrigins = [
    "http://localhost:5173",
    "https://attendify-frontend-fmlxy7z9t-joneskatarinas-projects.vercel.app"
];

exports.globalSecurity = (app) => {
    // Security headers
    app.use(helmet());

    // ✅ SINGLE CORS CONFIG (NO wildcard route)
    app.use(
        cors({
            origin: (origin, callback) => {
                if (!origin) return callback(null, true); // allow Postman
                if (allowedOrigins.includes(origin)) {
                    return callback(null, true);
                }
                return callback(null, false);
            },
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        })
    );

    // ✅ Rate limiting (API only)
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
    message: "Too many login attempts. Try again later.",
});
