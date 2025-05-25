/* eslint-disable @typescript-eslint/no-explicit-any */
import Router from "@koa/router";
import { Context } from "koa";
import { register, login } from "../service/users"; // import correct services

const authRouter = new Router();

// POST /auth/register
/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: testuser
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 username:
 *                   type: string
 *       400:
 *         description: Invalid input
 */
authRouter.post("/register", async (ctx: Context) => {
  ctx.response.body = await register(ctx.request.body as any);
});

// POST /auth/login
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login a user and return JWT
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: testuser
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     username:
 *                       type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
authRouter.post("/login", async (ctx: Context) => {
  ctx.response.body = await login(ctx.request.body as any);
});

export default authRouter;
