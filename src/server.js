const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const { globalSecurity } = require("./middlewares/securityLayer");

const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// MongoDB strict query
mongoose.set("strictQuery", true);

// Security + CORS (ONLY HERE)
globalSecurity(app);

// Body parser
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/attendance-sessions", attendanceRoutes);
app.use("/api/v1/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({ status: "Attendify backend running" });
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () =>
            console.log(`Server running on port ${PORT}`)
        );
    })
    .catch((err) => {
        console.error("MongoDB error:", err.message);
        process.exit(1);
    });
