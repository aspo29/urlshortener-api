import knex from "../config/knex";
import HttpError from "http-errors";

export interface RateLimitRecord {
  user_id: number;
  count: number;
  reset_at: Date;
  created_at: Date;
  updated_at: Date;
}

export const getRateLimit = async (
  userId: number
): Promise<RateLimitRecord | undefined> => {
  return knex<RateLimitRecord>("rate_limits")
    .where({ user_id: userId })
    .first();
};

export const createRateLimit = async (
  userId: number,
  resetAt: Date
): Promise<void> => {
  await knex("rate_limits").insert({
    user_id: userId,
    count: 1,
    reset_at: resetAt,
  });
};

export const resetRateLimit = async (
  userId: number,
  resetAt: Date
): Promise<void> => {
  await knex("rate_limits").where({ user_id: userId }).update({
    count: 1,
    reset_at: resetAt,
    updated_at: knex.fn.now(),
  });
};

export const incrementCount = async (userId: number): Promise<void> => {
  const updated = await knex("rate_limits")
    .where({ user_id: userId })
    .increment("count", 1)
    .update({ updated_at: knex.fn.now() });

  if (!updated) {
    throw new HttpError.InternalServerError(
      "Failed to increment rate limit count"
    );
  }
};
