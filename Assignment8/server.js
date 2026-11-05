const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory data: it resets whenever the server restarts.
const items = [
  { id: 1, name: "Room A-101", roomNumber: "A-101", sharing: "Double Sharing", rent: 8500, available: true },
  { id: 2, name: "Room B-204", roomNumber: "B-204", sharing: "Single Room", rent: 12000, available: false },
  { id: 3, name: "Room C-110", roomNumber: "C-110", sharing: "Triple Sharing", rent: 6500, available: true },
  { id: 4, name: "Room D-305", roomNumber: "D-305", sharing: "Double Sharing", rent: 9000, available: true }
];

let nextId = 5;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// GET /items - return every room in the catalogue.
app.get("/items", (req, res) => {
  res.status(200).json(items);
});

// GET /items/:id - return one room, or 404 when that ID does not exist.
app.get("/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const room = items.find((item) => item.id === id);

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  res.status(200).json(room);
});

// POST /items - create a room after validating the submitted JSON.
app.post("/items", (req, res) => {
  const { name, roomNumber, sharing, rent, available } = req.body;

  if (!name || !roomNumber || !sharing || rent === undefined || rent === "") {
    return res.status(422).json({
      error: "name, roomNumber, sharing and rent are required"
    });
  }

  const numericRent = Number(rent);
  if (!Number.isFinite(numericRent) || numericRent < 0) {
    return res.status(422).json({ error: "rent must be a valid non-negative number" });
  }

  const room = {
    id: nextId++,
    name: name.trim(),
    roomNumber: roomNumber.trim(),
    sharing: sharing.trim(),
    rent: numericRent,
    available: available !== false
  };

  items.push(room);
  res.status(201).json(room);
});

app.listen(PORT, () => {
  console.log(`Hostel/PG Room Catalogue is running at http://localhost:${PORT}`);
});
