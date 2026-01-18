const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");

/* ======================================================
   GLOBAL SECURITY MIDDLEWARE
   ====================================================== */
exports.globalSecurity = (app) => {
    // 1️⃣ Secure HTTP headers
    app.use(helmet());

    // 2️⃣ Prevent MongoDB operator injection
    // Only sanitize req.body and req.params, skip req.query
    app.use(
        mongoSanitize({
            replaceWith: "_",
            allowQuery: false
        })
    );

    // 3️⃣ CORS (adjust frontend URL when deployed)
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
    }));

    // 4️⃣ General API rate limiting
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 200,
        message: "Too many requests, try again later"
    });
    app.use("/api", apiLimiter);
};

/* ======================================================
   LOGIN BRUTE-FORCE PROTECTION
   ====================================================== */
exports.loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    message: "Too many login attempts. Try again later."
});
