require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const { ApolloServer } = require("@apollo/server");
const {
  expressMiddleware
} = require("@apollo/server/express4");

const { readFileSync } = require("fs");
const db = require("./db");

const typeDefs = readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf8"
);

const resolvers = {
  Query: {
    // Fetch all PG listings
    listings: async () => {
      const [rows] = await db.query(`
        SELECT
          id,
          name,
          location,
          monthly_rent AS monthlyRent,
          available
        FROM listings
        ORDER BY id
      `);

      return rows.map(row => ({
        ...row,
        available: Boolean(row.available)
      }));
    },

    // Fetch one PG listing by ID
    listing: async (_, { id }) => {
      const [rows] = await db.execute(
        `SELECT
          id,
          name,
          location,
          monthly_rent AS monthlyRent,
          available
         FROM listings
         WHERE id = ?`,
        [Number(id)]
      );

      if (rows.length === 0) {
        return null;
      }

      return {
        ...rows[0],
        available: Boolean(rows[0].available)
      };
    }
  },

  Mutation: {
    // Add a new PG listing
    addListing: async (_, { input }) => {
      if (input.monthlyRent < 0) {
        throw new Error(
          "Monthly rent must be zero or greater."
        );
      }

      const available =
        input.available === undefined
          ? true
          : input.available;

      const [result] = await db.execute(
        `INSERT INTO listings
          (name, location, monthly_rent, available)
         VALUES (?, ?, ?, ?)`,
        [
          input.name,
          input.location,
          input.monthlyRent,
          available ? 1 : 0
        ]
      );

      const [rows] = await db.execute(
        `SELECT
          id,
          name,
          location,
          monthly_rent AS monthlyRent,
          available
         FROM listings
         WHERE id = ?`,
        [result.insertId]
      );

      return {
        ...rows[0],
        available: Boolean(rows[0].available)
      };
    }
  }
};

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.static(path.join(__dirname, "public")));

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await server.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server)
  );

  const PORT = Number(process.env.PORT || 4000);

  app.listen(PORT, () => {
    console.log(
      `Hostel PG Tracker: http://localhost:${PORT}`
    );
    console.log(
      `GraphQL endpoint: http://localhost:${PORT}/graphql`
    );
  });
}

startServer().catch(error => {
  console.error("Failed to start server:", error);
  process.exit(1);
});