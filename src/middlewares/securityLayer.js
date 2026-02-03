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

    // ✅ CORS — MUST COME BEFORE EVERYTHING
    app.use(
        cors({
            origin: (origin, callback) => {
                // Allow server-to-server, Postman, curl
                if (!origin) return callback(null, true);

                if (allowedOrigins.includes(origin)) {
                    return callback(null, true);
                }

                // Reject others WITHOUT crashing
                return callback(null, false);
            },
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        })
    );

    // ✅ Explicitly handle preflight
    app.options(/.*/, cors());

    // API rate limiter
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200,
        standardHeaders: true,
        legacyHeaders: false,
    });

    app.use("/api", apiLimiter);
};

exports.loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many login attempts. Try again later.",
});
