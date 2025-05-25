import Router from "@koa/router";
import authRouter from "./auth";
import urlsRouter from "./urls";
import { rateLimiter, requireAuthHandler } from "./middlewares";
import { resolveUrl } from "../service/urls";
import { Context } from "koa";
import visitsRouter from "./visits";

const router = new Router();

// Mount /auth/*
router.use('/auth', authRouter.routes(), authRouter.allowedMethods());
router.use(
  "/urls",
  requireAuthHandler,
  rateLimiter,
  urlsRouter.routes(),
  urlsRouter.allowedMethods()
);

router.use(
  "/visits",
  requireAuthHandler,
  rateLimiter,
  visitsRouter.routes(),
  visitsRouter.allowedMethods()
);
/**
 * @openapi
 * /{id}:
 *   get:
 *     summary: Resolve short URL and redirect
 *     description: Resolves a short URL ID to its full URL and redirects the user. The user's IP is logged for visit tracking.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Short URL ID
 *     responses:
 *       302:
 *         description: Redirect to the original URL
 *       404:
 *         description: URL not found
 */
router.get("/:id", async (ctx: Context) => {
  const id = ctx.params.id;
  const ip = ctx.request.ip;

  const url = await resolveUrl(id, ip);
  ctx.redirect(url);
});

export default router;
