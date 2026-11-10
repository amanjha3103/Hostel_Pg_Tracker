
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const listingRoutes = require("./routes/listingRoutes");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());

app.use("/api/listings", listingRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Hostel PG Tracker Listing Service is running",
  });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(process.env.PORT || 5002, () => {
      console.log(
        `Listing Service running on port ${process.env.PORT || 5002}`
      );
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
