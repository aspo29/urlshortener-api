import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable("users", (table) => {
      // Primary key ID column that auto-increments
      table.increments("id").primary();

      // Username: unique and not nullable
      table.string("username").notNullable().unique();

      // Password: stored as hashed text, not nullable
      table.text("password").notNullable();

      // Timestamps: created_at and updated_at with default to now()
      table.timestamps(true, true);
    })

    // URLS TABLE
    .createTable("urls", function (table) {
      table
        .string("id")
        .primary()
        .defaultTo(knex.raw(`substring(md5(random()::text), 1, 6)`)); // Random 6-char ID
      table.text("url").notNullable();
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.timestamps(true, true);
    })

    // VISITS TABLE
    .createTable("visits", function (table) {
      table.increments("id").primary();
      table
        .string("url_id")
        .notNullable()
        .references("id")
        .inTable("urls")
        .onDelete("CASCADE");
      table.string("ip");
      table.timestamps(true, true); // to log visit time
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists("visits")
    .dropTableIfExists("urls")
    .dropTableIfExists("users");
}
