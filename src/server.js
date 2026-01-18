const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const { globalSecurity } = require("./middlewares/securityLayer");
const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes"); // <- new

const app = express();

// MongoDB strict query
mongoose.set("strictQuery", true);

// Global security middlewares
globalSecurity(app);

// Body parser
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/attendance-sessions", attendanceRoutes); // <- new attendance routes

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
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    });
