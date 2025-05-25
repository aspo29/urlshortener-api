import httpError from "http-errors";
import knex from "../config/knex";
import { validateCreateShortURL, validateUpdateShortURL } from "./validations";
import { registerVisit } from "./visits";

type CreateShortUrlBody = {
  url: string;
  id?: string;
};

interface URLRecord {
  id: string;
  url: string;
  user_id: number;
}

export const createShortUrl = async (
  body: CreateShortUrlBody,
  userId: number
) => {
  await validateCreateShortURL(body);

  // If user provided a custom ID, validate it doesn't exist already
  if (body.id) {
    const existing = await knex<URLRecord>("urls")
      .select("id")
      .where({ id: body.id })
      .first();

      if (existing) {
        console.warn(`Conflict: ID '${body.id}' already exists in database.`);
        throw new httpError.Conflict(
          `The custom ID '${body.id}' already exists. Please choose another one.`
        );
      }      
  }
  // Generate random ID if none provided
  // const generatedId = body.id || Math.random().toString(36).substring(2, 8);

  try{
  // Insert new record
  const [result] = await knex("urls")
    .insert({
      id: body.id,
      url: body.url,
      user_id: userId,
    })
    .returning("*");

  return result;
} catch (err) {
  console.error("Failed to insert URL:", err);
  throw new httpError.InternalServerError("Unable to create short URL.");
}
};

export const resolveUrl = async (id: string, ip:string) => {
  const record = await knex("urls").select("url").where({ id }).first();

  if (!record) {
    throw new httpError.NotFound("The ID you provided is not valid");
  }
  await registerVisit(id, ip);

  return record.url;
};
  

export async function updateURL(
  id: string,
  body: { url?: string },
  userId: number
): Promise<URLRecord> {

  await validateUpdateShortURL(body);

  const existingURL = await knex<URLRecord>("urls")
    .select("user_id")
    .where({ id })
    .first();

  if (!existingURL) {
    throw new httpError.NotFound("URL not found.");
  }

  if (existingURL.user_id !== userId) {
    throw new httpError.Unauthorized("You do not have permission to update this URL.");
  }

  const [updated] = await knex<URLRecord>("urls")
    .where({ id })
    .update({ url: body.url })
    .returning(["id", "url", "user_id"]);

  return updated;
}

export async function deleteURL(id: string, userId: number): Promise<boolean> {
  const existingURL = await knex<URLRecord>("urls")
    .select("user_id")
    .where({ id })
    .first();

  if (!existingURL) {
    throw new httpError.NotFound("URL not found.");
  }

  if (existingURL.user_id !== userId) {
    throw new httpError.Unauthorized("You do not have permission to delete this URL.");
  }

  await knex("urls").where({ id }).delete();

  return true;
}

export async function getURLs(
  userId: number,
  limit?: number,
  offset?: number
): Promise<unknown[]> {
  const results = await knex("urls")
    .leftJoin("visits", "urls.id", "visits.url_id")
    .where("urls.user_id", userId)
    .groupBy("urls.id")
    .orderBy("urls.created_at", "desc")
    .limit(limit ?? 15)
    .offset(offset ?? 0)
    .select([
      "urls.id as urlId",
      "urls.url",
      "urls.created_at as createdAt",
      knex.raw("count(visits.id) as visitsCount"),
    ]);
  return results;
}