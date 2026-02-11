require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const { globalSecurity } = require("./middlewares/securityLayer");
const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// MongoDB strict query
mongoose.set("strictQuery", true);

// Apply security, CORS, rate limiting
globalSecurity(app);

// Body parser
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/attendance-sessions", attendanceRoutes);
app.use("/api/v1/admin", adminRoutes);

// Role-based health check (example)
app.get("/", (req, res) => {
    res.json({ status: "Attendify backend running" });
});

// Error handler middleware (catch all)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    });