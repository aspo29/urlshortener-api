import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("rate_limits", (table) => {
    table
      .integer("user_id")
      .unsigned()
      .primary()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.integer("count").notNullable().defaultTo(0);
    table.timestamp("reset_at").notNullable();

    table.timestamps(true, true); // adds created_at and updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("rate_limits");
}
