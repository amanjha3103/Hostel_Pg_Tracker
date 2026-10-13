# Hostel PG Tracker — Project Brief

## 1. What — What does the system do?

The Hostel PG Tracker is a web-based system that helps students find suitable hostels and Paying Guest (PG) accommodations. It provides a common platform where students can view accommodation details, compare monthly rents, check available beds, and submit booking requests. PG owners can manage their accommodation listings, update room availability, and handle booking requests. Administrators can oversee users and listings to maintain the platform.

The system uses RESTful web services to connect the frontend with the backend. The frontend sends HTTP requests, the backend processes them, and MongoDB stores the application data through Prisma ORM.

## 2. Who — Who uses the system?

- **Student/Tenant:** Searches for accommodations, views details, and manages booking requests.
- **PG/Hostel Owner:** Creates and updates listings, manages rent and availability, and handles bookings.
- **Administrator:** Manages users, reviews listings, and oversees platform activities.

## 3. Nouns — Things and Services

Nouns represent the main entities, resources, and services in the system.

### Things (Entities/Resources)
1. **User** — A person registered on the platform.
2. **Student/Tenant** — A user looking for accommodation.
3. **PG/Hostel Owner** — A user providing accommodation.
4. **Administrator** — A user responsible for platform management.
5. **PG/Hostel Listing** — Accommodation information, including name, location, rent, and amenities.
6. **Room/Bed** — Accommodation units and their availability.
7. **Booking** — A student's request to reserve accommodation.
8. **Booking Status** — The current state of a booking, such as pending, approved, or cancelled.

### Services
1. **Authentication Service** — Handles user registration and login.
2. **Accommodation Service** — Provides listing creation, updates, retrieval, and deletion.
3. **Search Service** — Helps students find accommodations.
4. **Booking Service** — Processes and manages booking requests.
5. **Administration Service** — Supports user and listing management.

## 4. Verbs — Actions, Tasks, and Contracts

Verbs describe the operations users perform and the actions provided by the system's web services.

### User Actions
- Register an account.
- Log in and log out.
- Search for hostels and PGs.
- View accommodation details.
- Check rent and bed availability.
- Submit a booking request.
- View or cancel a booking.

### Owner Actions
- Create an accommodation listing.
- View and retrieve listings.
- Update accommodation details.
- Update rent and bed availability.
- Delete a listing.
- View and manage booking requests.

### Administrator Actions
- View and manage users.
- Review accommodation listings.
- Remove inappropriate or invalid listings.
- Monitor platform activities.

### Web Service Contracts (API Operations)
- `GET /api/pgs` — Retrieve accommodation listings.
- `GET /api/pgs/:id` — Retrieve a specific listing.
- `POST /api/pgs` — Create a listing.
- `PUT /api/pgs/:id` — Update a listing.
- `DELETE /api/pgs/:id` — Delete a listing.
- `POST /api/bookings` — Submit a booking request.
- `GET /api/bookings` — Retrieve relevant booking records.

These endpoints describe the proposed service contracts and should be updated if the final API design differs.

## Conclusion

The Hostel PG Tracker connects students, accommodation owners, and administrators through a single web application. Its main resources are users, listings, rooms, and bookings, while its main operations include searching, creating, updating, retrieving, and managing accommodations and bookings. The project demonstrates how RESTful web services support communication between a frontend, backend, and database.