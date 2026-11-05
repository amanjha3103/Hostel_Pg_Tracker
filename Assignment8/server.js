const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

const items = [
  {
    id: 1,
    name: "Room A-101",
    roomNumber: "A-101",
    sharing: "Double Sharing",
    rent: 8500,
    available: true
  },
  {
    id: 2,
    name: "Room B-204",
    roomNumber: "B-204",
    sharing: "Single Room",
    rent: 12000,
    available: false
  },
  {
    id: 3,
    name: "Room C-110",
    roomNumber: "C-110",
    sharing: "Triple Sharing",
    rent: 6500,
    available: true
  }
];

let nextId = 4;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/items", (req, res) => {
  res.status(200).json(items);
});

app.get("/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const room = items.find((item) => item.id === id);

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  res.status(200).json(room);
});

app.post("/items", (req, res) => {
  const { name, roomNumber, sharing, rent, available } = req.body;

  if (!name || !roomNumber || !sharing || rent === undefined) {
    return res.status(422).json({
      error: "name, roomNumber, sharing and rent are required"
    });
  }

  const newRoom = {
    id: nextId++,
    name,
    roomNumber,
    sharing,
    rent: Number(rent),
    available: available !== false
  };

  items.push(newRoom);
  res.status(201).json(newRoom);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});