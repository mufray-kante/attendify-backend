const { globalSecurity } = require("./middlewares/securityLayer");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();
globalSecurity(app);
/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- ROUTES ---------------- */
app.use('/api/v1/auth', authRoutes);

/* ---------------- HEALTH CHECK ---------------- */
app.get('/', (req, res) => {
    res.json({ status: 'Attendify backend running' });
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(PORT, () =>
            console.log(`Server running on port ${PORT}`)
        );
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });
