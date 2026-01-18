const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const { globalSecurity } = require("./middlewares/securityLayer");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Mongo security
mongoose.set("strictQuery", true);

// Global security
globalSecurity(app);

// Body parser
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({ status: "Attendify backend running" });
});

// Start server
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
        app.listen(PORT, () =>
            console.log(`Server running on port ${PORT}`)
        );
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    });
