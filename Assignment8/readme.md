# Assignment 8 - Hostel/PG Room Availability Catalogue

An Express REST API and a small HTML/CSS interface for the **Hostel/PG Room Availability Catalogue** service. It is a separate Assignment 8 folder inside the Hostel_Pg_Tracker repository; the existing project is not changed.

## Team members

| Name | Roll number |
| --- | --- |
| Md Kaif | 20251651055 |
| Himanshu Singh | 20251651044 |
| Aman Jha | 20251651016 |

## Run locally

```bash
cd Assignment8
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Assignment answers

### 1. Selected service and routes

The selected CampusEats-style service is **Hostel/PG Room Availability Catalogue**. Each item is a room with its room number, sharing type, monthly rent, and availability.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/items` | Returns all rooms in the catalogue. |
| GET | `/items/:id` | Returns the room with the requested ID. |
| POST | `/items` | Creates a new room from JSON sent by the form. |

### 2. HTTP status codes

- `200 OK`: a list of rooms or one existing room was returned.
- `201 Created`: a new room was successfully added with `POST /items`.
- `404 Not Found`: no room exists with the ID in `GET /items/:id`.
- `422 Unprocessable Content`: the `POST` body is missing a required field or has an invalid rent.

### 3. `req.params`, `req.body`, and `express.json()`

`req.params.id` is used in `GET /items/:id` to read the room ID from the URL. `req.body` is used in `POST /items` to read the new room details sent by the frontend. `express.json()` parses JSON request data so that Express can make it available in `req.body`; without it, the POST data would not be read correctly.

## Screenshots and demonstration

Add the two real screenshots to the `screenshots` folder after running the app:

1. `before-post.png` - the initial four seed rooms.
2. `after-post.png` - the list after adding one new room.

Google Drive demonstration video: add the shared link here after recording.
