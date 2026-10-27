# Hostel PG Tracker — GraphQL Service

## 1. Project Overview

This project implements a GraphQL API for the **Hostel PG Tracker** application. It provides a way to retrieve PG/hostel listings and add new listings through GraphQL queries and mutations.

The application uses Apollo Server, Node.js, Express.js, and MySQL, with a simple HTML, CSS, and JavaScript frontend.

## 2. Selected Service

**Listing Service**

The Listing Service manages accommodation information, including PG name, location, monthly rent, and availability.

## 3. Technologies Used

- Node.js
- Express.js
- Apollo Server
- GraphQL
- MySQL
- HTML
- CSS
- JavaScript

## 4. Features

- Retrieve all PG listings.
- Retrieve a specific listing using its ID.
- Add a new PG listing.
- Store and retrieve listing information from MySQL.
- Display listings on a simple web page.

## 5. Project Structure

```text
Assignment7/
├── schema.graphql
├── server.js
├── db.js
├── schema.sql
├── package.json
├── .env
└── public/
    └── index.html
```

## 6. How to Run the Project

1. Install Node.js and MySQL.
2. Execute `schema.sql` in MySQL Workbench to create the database, table, and sample records.
3. Configure your MySQL credentials in the `.env` file.
4. Open a terminal in the project directory.
5. Install the dependencies:

   ```bash
   npm install
   ```

6. Start the server:

   ```bash
   npm start
   ```

7. Open `http://localhost:4000` in your browser.

The GraphQL endpoint is `http://localhost:4000/graphql`.

## 7. GraphQL Examples

### Query: Retrieve all listings

```graphql
query {
  listings {
    id
    name
    location
    monthlyRent
    available
  }
}
```

### Query: Retrieve a listing by ID

```graphql
query {
  listing(id: "1") {
    id
    name
    monthlyRent
    available
  }
}
```

### Mutation: Add a new listing

```graphql
mutation {
  addListing(
    input: {
      name: "River View PG"
      location: "Gandhinagar, Sector 5"
      monthlyRent: 8000
      available: true
    }
  ) {
    id
    name
    monthlyRent
  }
}
```

## 8. Assignment Questions

### Q1. Which service did you pick?

We selected the **Listing Service** of Hostel PG Tracker. It manages PG and hostel accommodation information and allows clients to retrieve existing listings or add new ones.

### Q2. Name one field a client can skip and one it cannot. Why do we use the `!` sign?

A client can omit the `location` field from its requested output fields because GraphQL allows clients to select only the fields they need.

The `!` symbol indicates a non-null type. For example, `name: String!` means the value cannot be null. In `AddListingInput`, `name` and `location` are required inputs.

### Q3. Which part of your query became `WHERE`, and which resolver ran `INSERT`?

The `listing(id: "1")` query passes the ID to the `listing` resolver. The resolver uses the ID in the SQL condition:

```sql
SELECT id, name, location, monthly_rent
FROM listings
WHERE id = ?;
```

The `Mutation.addListing` resolver executes the SQL `INSERT` statement to create a new listing in the database.

## 10. Team Members

Aman Jha,20251651016
Md. Kaif,20251651055
Himanshu Singh Deopa, 20251651044
