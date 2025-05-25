import knex from "../config/knex";
import HttpError from "http-errors";

// 1. Register a visit
export const registerVisit = async (urlId: string, ip: string) =>
  knex("visits").insert({ url_id: urlId, ip });

// Get the latest visits across all URLs for a user
export const getLastVisits = async (
  userId: number,
  limit: number = 15,
  offset: number = 0
) => {
  return knex("visits")
    .join("urls", "urls.id", "visits.url_id")
    .where("urls.user_id", userId)
    .orderBy("visits.created_at", "desc")
    .limit(limit || 15)
    .offset(offset || 0)
    .select([
      "urls.id as urlId",
      "urls.url",
      "visits.ip",
      "visits.created_at as visitedAt",
    ]);
};

// 4. Get visits for a specific URL if user owns it
export const getVisitsByUrl = async (
  urlId: string,
  userId: number,
  limit: number = 15,
  offset: number = 0
) => {
  const url = await knex("urls").where({ id: urlId }).select("user_id").first();

  if (!url) {
    throw new HttpError.NotFound("URL not found");
  }

  if (url.user_id !== userId) {
    throw new HttpError.Unauthorized("Unauthorized access to this URL");
  }

  return knex("visits")
    .where({ url_id: urlId })
    .orderBy("created_at", "desc")
    .limit(limit)
    .offset(offset)
    .select(["ip", "created_at as visitedAt"]);
};
