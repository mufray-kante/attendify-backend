const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

exports.globalSecurity = (app) => {
    app.use(helmet());

    // Updated CORS for localhost and Vercel
    app.use(cors({
        origin: [
            'http://localhost:5173',
            'https://attendify-frontend-nine.vercel.app'
        ],
        credentials: true
    }));

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
