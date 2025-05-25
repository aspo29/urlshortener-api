import dotenv from "dotenv";
dotenv.config();

import type { Knex } from "knex";

const { DB_HOST, DB_PORT, DB_USER, DB_DATABASE, DB_PASSWORD, DATABASE_URL } =
  process.env;

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      host: DB_HOST,
      port: Number(DB_PORT) || 5432,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      host: DB_HOST,
      port: Number(DB_PORT) || 5432,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "pg",
    connection: {
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;
