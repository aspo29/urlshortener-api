import { Context, Next } from "koa";
import HttpError from "http-errors";
import { validateToken } from "../config/jwt";

import * as rateLimitService from "../service/rate";

const LIMIT = 100;
const WINDOW_MS = 24 * 60 * 60 * 1000;

export async function requireAuthHandler(ctx: Context, next: Next) {
  const header = ctx.request.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new HttpError.Unauthorized("Please provide a token");
  }

  const token = header.split(" ")[1]; // Extract token from "Bearer <token>"
  try {
    const payload = (await validateToken(token)) as { id: number|string }; // Cast payload to expected shape
    ctx.state.userId = payload.id; // Attach user ID to state
    await next(); // Continue to next middleware/route
  } catch {
    throw new HttpError.Unauthorized("Invalid or expired token");
  }
}

export async function rateLimiter(ctx: Context, next: Next) {
  const userId = ctx.state.userId;

  if (typeof userId !== "number") {
    throw new HttpError.BadRequest("Invalid user ID in request context");
  }

  const now = new Date();
  const record = await rateLimitService.getRateLimit(userId);

  if (!record) {
    await rateLimitService.createRateLimit(
      userId,
      new Date(now.getTime() + WINDOW_MS)
    );
    return next();
  }

  if (new Date(record.reset_at) < now) {
    await rateLimitService.resetRateLimit(
      userId,
      new Date(now.getTime() + WINDOW_MS)
    );
    return next();
  }

  if (record.count >= LIMIT) {
    ctx.status = 429;
    ctx.body = {
      message:
        "Rate limit exceeded. Try again after " +
        new Date(record.reset_at).toISOString(),
    };
    return;
  }

  await rateLimitService.incrementCount(userId);
  return next();
}