require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../src/models/User");

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existing = await User.findOne({
            email: "joneskatarinawitt@gmail.com",
        });

        if (existing) {
            console.log("ℹ️ Admin already exists");
            process.exit(0);
        }

        const passwordHash = await bcrypt.hash("9843", 10);

        await User.create({
            fullName: "Raymond Mwenda",
            email: "joneskatarinawitt@gmail.com",
            passwordHash,
            role: "ADMIN", // ✅ MUST MATCH ENUM EXACTLY
        });

        console.log("✅ Admin user created successfully");
        process.exit(0);
    } catch (err) {
        console.error("❌ Failed to seed admin:", err.message);
        process.exit(1);
    }
}

createAdmin();
