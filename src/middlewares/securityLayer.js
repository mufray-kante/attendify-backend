const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

exports.globalSecurity = (app) => {
    // Security headers
    app.use(helmet());

    // CORS — single source of truth
    app.use(
        cors({
            origin: [
                "http://localhost:5173",
                "https://attendify-frontend-fmlxy7z9t-joneskatarinas-projects.vercel.app"
            ],
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true
        })
    );

    // Handle preflight requests explicitly
    app.options("*", cors());

    // API rate limiting
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
