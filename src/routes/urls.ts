
/* eslint-disable @typescript-eslint/no-explicit-any */
import Router from "@koa/router";
import { Context } from "koa";
import { createShortUrl, getURLs, updateURL, deleteURL } from "../service/urls";

const urlsRouter = new Router();

// GET /urls - Get all URLs for authenticated user
/**
 * @openapi
 * /urls:
 *   get:
 *     summary: Get all short URLs for the authenticated user
 *     tags:
 *       - URLs
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: A list of short URLs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   url:
 *                     type: string
 *                   short:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */

urlsRouter.get("/", async (ctx: Context) => {
  const userId = ctx.state.userId;
  const limit = Number(ctx.request.query.limit || 10);
  const offset = Number(ctx.request.query.offset || 0);

  ctx.response.body = await getURLs(userId, limit, offset);
});

// POST /urls - Create a new short URL
/**
 * @openapi
 * /urls:
 *   post:
 *     summary: Create a new short URL
 *     tags:
 *       - URLs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 example: https://example.com
 *     responses:
 *       200:
 *         description: Short URL created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 url:
 *                   type: string
 *                 short:
 *                   type: string
 */

urlsRouter.post("/", async (ctx: Context) => {
  const userId = ctx.state.userId;
  const body = ctx.request.body as any;

  ctx.response.body = await createShortUrl(body, userId);
});

// PUT /urls/:id - Update an existing short URL
/**
 * @openapi
 * /urls/{id}:
 *   put:
 *     summary: Update an existing short URL
 *     tags:
 *       - URLs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Short URL ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: https://updated-example.com
 *     responses:
 *       200:
 *         description: Short URL updated
 */

urlsRouter.put("/:id", async (ctx: Context) => {
  const urlId = ctx.params.id;
  const userId = ctx.state.userId;
  const body = ctx.request.body as any;

  ctx.response.body = await updateURL(urlId, body, userId);
});

// DELETE /urls/:id - Delete a short URL
/**
 * @openapi
 * /urls/{id}:
 *   delete:
 *     summary: Delete a short URL
 *     tags:
 *       - URLs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Short URL ID
 *     responses:
 *       200:
 *         description: Short URL deleted
 */

urlsRouter.delete("/:id", async (ctx: Context) => {
  const urlId = ctx.params.id;
  const userId = ctx.state.userId;

  ctx.response.body = await deleteURL(urlId, userId);
});

export default urlsRouter;

