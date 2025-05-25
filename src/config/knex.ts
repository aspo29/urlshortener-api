// knex.config.ts
import dotenv from "dotenv";
dotenv.config();
import Knex from "knex";

// const { DB_HOST, DB_PORT, DB_USER, DB_DATABASE, DB_PASSWORD } =
//   process.env;
  const {  DB_PORT, DATABASE_URL } =
    process.env;
if (!DB_PORT) throw new Error("DB_PORT is not defined");

const knex = Knex({
  client: "pg", // Using PostgreSQL
  connection: {
    // host: DB_HOST,
    // port: Number(DB_PORT),
    // user: DB_USER,
    // password: DB_PASSWORD,
    // database: DB_DATABASE,
    // ssl: { rejectUnauthorized: false },
    connectionString: DATABASE_URL, // Use DATABASE_URL for Heroku or other environments
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false, // Disable SSL if not using DATABASE_URL
  },
  debug: process.env.DEBUG === "knex:query",
});

// Function to test database connection
export async function onDatabaseConnect(): Promise<void> {
  try {
    await knex.raw("SELECT 1");
  } catch (error) {
    throw new Error("Database connection failed: " + error);
  }
}

export default knex;
