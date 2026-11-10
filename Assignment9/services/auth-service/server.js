
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes")
const cors = require("cors");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
;

app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hostel PG Tracker Auth Service is running" });
});



app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const User = require("./models/User");

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch user details.",
    });
  }
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(process.env.PORT || 5001, () => {
      console.log(`Auth Service running on port ${process.env.PORT || 5001}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
