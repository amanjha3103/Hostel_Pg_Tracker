
const express = require("express");
const Listing = require("../models/Listing");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const router = express.Router();


// GET /api/listings — retrieve active listings
router.get("/",authMiddleware, async (req, res) => {
  try {
    const listings = await Listing.find({ status: "ACTIVE" })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: listings.length,
      listings,
    });
 } catch (error) {
  console.error("Create listing error:", error);

  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({
      message: "Invalid listing data.",
    });
  }

  return res.status(500).json({
    message: "Unable to create listing.",
  });
}
});

// POST /api/listings — create a listing
router.post("/",authMiddleware, authorizeRoles("owner","admin"), async (req, res) => {
  try {
    const {
      name,
      location,
      monthlyRent,
      description,
      amenities,
      roomType,
      availableSeats,
      image,
    } = req.body;

    if (
      typeof name !== "string" || !name.trim() ||
      typeof location !== "string" || !location.trim() ||
      monthlyRent === undefined ||
      !Number.isFinite(monthlyRent) ||
      monthlyRent < 0 ||
      availableSeats === undefined ||
      !Number.isInteger(availableSeats) ||
      availableSeats < 0
    ) {
      return res.status(400).json({
        message: "Provide a name, location, valid monthly rent, and valid available seats.",
      });
    }

    if (
      amenities !== undefined &&
      (!Array.isArray(amenities) ||
        !amenities.every((item) => typeof item === "string"))
    ) {
      return res.status(400).json({
        message: "Amenities must be an array of text values.",
      });
    }

    const listing = await Listing.create({
      name: name.trim(),
      location: location.trim(),
      monthlyRent,
      description,
      amenities,
      roomType,
      availableSeats,
      image,
      ownerId: req.userId,
    });

    return res.status(201).json({
      message: "Listing created successfully.",
      listing,
    });
  } catch (error) {
    console.error("Create listing error:", error.message);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid listing data.",
      });
    }

    return res.status(500).json({
      message: "Unable to create listing.",
    });
  }
});

module.exports = router;
