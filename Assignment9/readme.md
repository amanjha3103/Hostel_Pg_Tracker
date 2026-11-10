# CS543 – Assignment 09: Securing the API

## Project: Hostel PG Tracker

**Course:** CS543 – Web Services  
**Assignment:** 09 of 12 – Securing the API  
**Institute:** IIIT Vadodara

## 1. Team Members

| Name | Roll Number | Contribution |
|---|---|---|
| Aman Jha | 20251651016 | Frontend and System Design |
| Himanshu Singh Deopa | 20251651044 | Backend and Services |
| Md. Kaif | 20251761055 | Testing and Database |

## 2. Objective

The objective of this assignment is to secure the existing REST APIs of the Hostel PG Tracker project using JWT authentication and role-based authorization.

The implementation includes:
- Secure password storage using bcrypt.
- User login and JWT token generation.
- JWT authentication middleware.
- Role-based authorization middleware.
- Protection of listing read and write endpoints.
- Proper HTTP responses for unauthorized and forbidden requests.

## 3. Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Token (jsonwebtoken)
- bcryptjs
- dotenv
- Thunder Client

## 4. Project Structure

```text
Hostel_PG_Tracker/
│
└── services/
    │
    ├── auth-service/
    │   ├── middleware/
    │   │   └── authMiddleware.js
    │   ├── models/
    │   │   └── User.js
    │   ├── routes/
    │   │   └── authRoutes.js
    │   ├── server.js
    │   ├── .env
    │   └── package.json
    │
    └── listing-service/
        ├── middleware/
        │   ├── authMiddleware.js
        │   └── authorizeRoles.js
        ├── models/
        │   └── Listing.js
        ├── routes/
        │   └── listingRoutes.js
        ├── server.js
        ├── .env
        └── package.json
```

## 5. Implementation

### 5.1 Password Hashing

Passwords are hashed using bcryptjs before being stored in MongoDB.

The application uses bcrypt hashing to ensure that passwords are not stored in plain text.

During login, the entered password is compared with the stored password hash using bcrypt.

### 5.2 User Authentication

The Auth Service provides signup and login functionality.

**Login endpoint:**

```http
POST /api/auth/login
```

Example request:

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

After successful verification, the server generates a JWT containing the user's ID and role.

The token includes an expiration time of one hour.

### 5.3 JWT Authentication Middleware

The authentication middleware:
1. Reads the Authorization header.
2. Extracts the Bearer token.
3. Verifies the token using `jwt.verify()`.
4. Extracts the user ID and role.
5. Returns HTTP 401 if the token is missing, invalid, or expired.

### 5.4 Role-Based Authorization

The authorization middleware checks whether the authenticated user's role is permitted to access a particular route.

The application uses the following roles:

| Role | Permission |
|---|---|
| student | View protected listings |
| owner | View and create listings |
| admin | View and create listings |

The middleware returns HTTP 403 if an authenticated user does not have the required role.

## 6. Protected API Endpoints

| HTTP Method | Endpoint | Authentication | Allowed Role |
|---|---|---|---|
| POST | `/api/auth/signup` | Not required | Public |
| POST | `/api/auth/login` | Not required | Public |
| GET | `/api/auth/me` | Required | Any authenticated user |
| GET | `/api/listings` | Required | Any authenticated user |
| POST | `/api/listings` | Required | owner, admin |

## 7. API Testing Using Thunder Client

The APIs were tested using Thunder Client in Visual Studio Code.

The following test cases demonstrate authentication and authorization.

### Test Case 1: Request Without Token

**Request:**

```http
GET /api/listings
```

No Authorization header is provided.

**Expected response:** HTTP 401 Unauthorized.

```json
{
  "message": "Authentication token is required."
}
```

### Test Case 2: Successful Login

**Request:**

```http
POST /api/auth/login
```

Valid user credentials are provided.

**Expected result:** HTTP 200 OK with a JWT token.

### Test Case 3: Request With Valid Token

**Request:**

```http
GET /api/listings
```

A valid JWT is provided in the Bearer Token authorization header.

**Expected result:** HTTP 200 OK with the listings response.

### Test Case 4: Privileged User Creates Listing

**Request:**

```http
POST /api/listings
```

An authenticated owner or admin sends valid listing data.

**Expected result:** HTTP 201 Created.

### Test Case 5: Student Attempts to Create Listing

**Request:**

```http
POST /api/listings
```

An authenticated student attempts to create a listing.

**Expected response:** HTTP 403 Forbidden.

```json
{
  "message": "Forbidden: You do not have permission."
}
```

## 8. Answers to Assignment Questions

### Q1. Which routes require only authentication, and which also require a role?

**Authentication only:**
- GET `/api/listings` – Any authenticated user.
- GET `/api/auth/me` – Any authenticated user.

**Authentication and role authorization:**
- POST `/api/listings` – Only users with the owner or admin role.

### Q2. Show one 401 and one 403 from your demo. Why did the server return each status?

**401 Unauthorized:** Returned when a request does not contain a valid JWT token. The server cannot authenticate the user.

**403 Forbidden:** Returned when a validly authenticated user does not have the required role to perform an operation. For example, a student cannot create a listing.

### Q3. What is inside your JWT payload? Why is it safe to trust the role claim on the server, and why must the secret stay out of your code?

The JWT payload contains:
- User ID (`userId`)
- User role (`role`)
- Issued-at timestamp (`iat`)
- Expiration timestamp (`exp`)

The server verifies the JWT signature using `jwt.verify()` and the secret key. This ensures that the signed claims have not been modified without invalidating the signature.

The JWT secret must remain outside the source code and be stored in an environment variable because exposing it could allow an attacker to generate forged tokens.

## 9. Environment Configuration

Sensitive configuration values are stored in `.env` files and are not committed to GitHub.

Example `.env.example`:

```env
PORT=
MONGODB_URI=
JWT_SECRET=
```

The `.env` files are included in `.gitignore` to prevent accidental exposure of credentials.

Both Auth Service and Listing Service use the same JWT secret for token signing and verification.

## 10. Conclusion

In this assignment, the Hostel PG Tracker REST APIs were secured using JWT authentication and role-based authorization.

Passwords are stored as bcrypt hashes, login generates signed JWT tokens, and middleware protects API endpoints.

The implementation demonstrates the difference between HTTP 401 Unauthorized and HTTP 403 Forbidden and ensures that only users with the required permissions can create PG listings.

Thus, the assignment demonstrates the implementation of essential API security mechanisms in a microservices-based application.