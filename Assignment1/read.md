# Hostel PG Tracker App

## 1. Project Overview

The **Hostel PG Tracker App** is a web-based application designed to help students find and manage hostel and Paying Guest (PG) accommodations. It provides a common platform where students can search for available accommodations, PG owners can manage their listings, and administrators can oversee platform activities.

The project demonstrates the use of web services and REST APIs to enable communication between the frontend, backend, and database.

## 2. Objectives

- Provide a centralized platform for finding hostels and PG accommodations.
- Allow students to view accommodation details, rent, amenities, and availability.
- Enable PG owners to create and manage accommodation listings.
- Support booking requests and booking management.
- Provide administrators with tools to manage users and listings.
- Demonstrate RESTful web service design and client-server communication.

## 3. User Roles

### Student / Tenant
- Register and log in to the application.
- Search and browse available hostels and PGs.
- View accommodation details, monthly rent, amenities, and available beds.
- Submit booking requests.
- View or cancel bookings, subject to the application's rules.

### PG / Hostel Owner
- Register and manage an owner account.
- Create, update, and delete accommodation listings.
- Manage rent, amenities, room details, and bed availability.
- View and manage booking requests.

### Administrator
- Manage user accounts.
- Review and manage accommodation listings.
- Monitor platform activities.
- Handle reported listings or other administrative issues.

## 4. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js |
| Web framework | Express.js |
| Database | MongoDB |
| ORM / Database client | Prisma ORM |
| API architecture | REST API |
| Data exchange format | JSON |
| API testing | Postman and cURL |
| Version control | Git and GitHub |

## 5. System Architecture

The application follows a client-server architecture.

1. **Frontend:** React.js provides the user interface.
2. **HTTP communication:** The frontend sends HTTP requests to the backend REST APIs.
3. **Routes and controllers:** Express.js receives requests and directs them to the appropriate controller.
4. **Validation layer:** Validates incoming data, including required fields and acceptable values.
5. **Service layer:** Implements application rules, such as checking accommodation availability and validating booking operations.
6. **Database access layer:** Prisma Client provides an interface for accessing MongoDB.
7. **Database:** MongoDB stores user, accommodation, and booking data.

### Request Flow

`React Frontend → HTTP Request → Express REST API → Validation → Service Layer → Prisma Client → MongoDB`

The response travels back to the frontend, generally as JSON with an appropriate HTTP status code.

## 6. Main Modules

### Authentication and User Management
Handles user registration, login, and role-based access to application features.

### Accommodation Management
Allows owners to create and maintain hostel and PG listings, including location, rent, amenities, and availability.

### Search and Listing
Allows students to browse and search accommodations using relevant criteria.

### Booking Management
Handles booking requests and their status. The backend must check availability before confirming a booking.

### Administration
Provides functionality for managing users and reviewing accommodation listings.

## 7. Web Services and REST API Design

The backend exposes RESTful endpoints that allow the frontend to communicate with the application.

Example endpoint design:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/pgs` | Retrieve accommodation listings |
| GET | `/api/pgs/:id` | Retrieve a specific listing |
| POST | `/api/pgs` | Create an accommodation listing |
| PUT | `/api/pgs/:id` | Update an accommodation listing |
| DELETE | `/api/pgs/:id` | Delete an accommodation listing |
| POST | `/api/bookings` | Submit a booking request |
| GET | `/api/bookings` | Retrieve relevant bookings |

These endpoints describe the proposed API design. Their actual availability depends on the backend implementation.

### HTTP Methods

- **GET:** Retrieves data.
- **POST:** Creates a resource or submits a request.
- **PUT:** Updates an existing resource.
- **DELETE:** Deletes a resource.

### JSON Communication

The frontend and backend exchange data in JSON format.

Example request body for creating a PG listing:

```json
{
  "name": "Sunrise PG",
  "location": "Gandhinagar, Gujarat",
  "monthlyRent": 8000,
  "availableBeds": 5
}
```

This is an illustrative request body. The backend must validate the values before storing them.

## 8. Database Design

The application uses MongoDB as its database and Prisma ORM for database access.

Proposed main data models include:

- **User:** Stores user information and role.
- **PG:** Stores accommodation details, location, rent, amenities, and availability.
- **Booking:** Stores booking information, the associated student and accommodation, and booking status.

The final fields, relationships, and constraints will depend on the implemented Prisma schema.

### Why MongoDB?

MongoDB is a document-oriented NoSQL database that stores records as documents in collections. It is suitable for applications that work with structured documents and flexible data models.

### Why Prisma ORM?

Prisma provides a convenient, type-safe database client for application code. It allows the backend to query and update MongoDB without manually writing every database operation.

Prisma does not replace MongoDB; it provides the application with an interface for accessing the database.


## 9. Learning Outcomes

This project aims to demonstrate:

- Client-server architecture.
- RESTful web service development.
- HTTP methods, status codes, headers, and JSON.
- Backend input validation and business logic.
- Database integration using Prisma ORM and MongoDB.
- API testing with Postman and cURL.
- Version control and collaborative development using Git and GitHub.

## 10. Conclusion

The Hostel PG Tracker App aims to simplify the process of finding and managing hostel and PG accommodations through a centralized web application. It combines a React frontend, a Node.js and Express.js backend, REST APIs, Prisma ORM, and MongoDB to demonstrate practical web service concepts.

The project can be extended with additional features as development progresses.

## 11. Contributors


- **Team Member 1:** Aman Jha 
- **Team Member 2:** Himanshu Singh Deopa 
- **Team Member 3:** Md. Kaif 

## 12. Project Status

**Status:** In development

Update this section as features are implemented and tested.
