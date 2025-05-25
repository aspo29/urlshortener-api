import Router from "@koa/router";
import { Context } from "koa";
import { getLastVisits, getVisitsByUrl } from "../service/visits";

const visitsRouter = new Router();

// GET /visits - Get all recent visits for the authenticated user
/**
 * @openapi
 * /visits:
 *   get:
 *     summary: Get recent visits for the authenticated user
 *     tags:
 *       - Visits
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of visits to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of visits to skip (for pagination)
 *     responses:
 *       200:
 *         description: List of recent visits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   urlId:
 *                     type: string
 *                   url:
 *                     type: string
 *                   ip:
 *                     type: string
 *                   visitedAt:
 *                     type: string
 *                     format: date-time
 */

visitsRouter.get("/", async (ctx: Context) => {
  const userId = ctx.state.userId;
  const limit = Number(ctx.request.query.limit || 10);
  const offset = Number(ctx.request.query.offset || 0);

  ctx.response.body = await getLastVisits(userId, limit, offset);
});

// GET /visits/:id - Get visits for a specific short URL
/**
 * @openapi
 * /visits/{id}:
 *   get:
 *     summary: Get visit history for a specific short URL
 *     tags:
 *       - Visits
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Short URL ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of visits to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of visits to skip (for pagination)
 *     responses:
 *       200:
 *         description: List of visits for the given short URL
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ip:
 *                     type: string
 *                   visitedAt:
 *                     type: string
 *                     format: date-time
 */

visitsRouter.get("/:id", async (ctx: Context) => {
  const urlId = ctx.params.id;
  const userId = ctx.state.userId;
  const limit = Number(ctx.request.query.limit || 10);
  const offset = Number(ctx.request.query.offset || 0);

  ctx.response.body = await getVisitsByUrl(urlId, userId, limit, offset);
});

export default visitsRouter;
