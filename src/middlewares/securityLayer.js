const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

exports.globalSecurity = (app) => {
    // Secure HTTP headers
    app.use(helmet());

    // CORS for local dev + production frontend
    const allowedOrigins = [
        'http://localhost:5173',
        'https://attendify-frontend-nine.vercel.app',
        'https://attendify-frontend-dnezjdnx3-joneskatarinas-projects.vercel.app'
    ];

    app.use(cors({
        origin: function(origin, callback){
            if(!origin) return callback(null, true);
            if(allowedOrigins.indexOf(origin) === -1){
                const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true
    }));

    // Global rate limit
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200,
        message: 'Too many requests, try again later'
    });

    app.use('/api', apiLimiter);
};

exports.loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts. Try again later.'
});
