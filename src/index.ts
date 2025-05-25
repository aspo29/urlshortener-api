/* eslint-disable @typescript-eslint/no-explicit-any */
import  { HttpError } from "http-errors";
// index.ts
import { onDatabaseConnect } from "./config/knex";
import Koa from "koa";
import helmet from "koa-helmet";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import router from "./routes/index";
import Router from "@koa/router";
import { koaSwagger } from "koa2-swagger-ui";
import { swaggerSpec } from "./config/swagger"; // adjust path
// import { login, register } from "./service/users";
// import { validateToken } from "./config/jwt";
// import { createShortUrl } from "./service/urls";

// import { validateCreateShortURL } from "./service/validations";

// try {
//   validateCreateShortURL({ url: "invalid-url", id: "1" });
// } catch (err) {
//   if (err instanceof Error) {
//     console.error("Validation error:", err.message);
//   } else {
//     console.error("Validation error:", err);
//   }
//   // Output: Validation error: The url format is invalid, The id must be at least 5 characters.
// }

// import Validator from "validatorjs";

// const data = {
//   url: "https://www.google.com",
//   id: "143",
// };

// const rules = {
//   url: "required|url",
//   id: "min:5|max:10", // Not required, but has length constraints
// };

// const validation = new Validator(data, rules);

// if (validation.fails()) {
//   const errors = validation.errors.all();
//   const aggregatedErrors: string[] = [];

//   Object.keys(errors).forEach((key) => {
//     aggregatedErrors.push(validation.errors.first(key) as string);
//   });

//   throw new Error(aggregatedErrors.join(", "));
// } else {
//   console.log("Validator passed");
// }

const app = new Koa();

const PORT = Number(process.env.PORT) || 3000;


// Global error handler (optional but recommended)
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = (typeof err === "object" && err !== null && "status" in err) ? (err as any).status : 500;
    ctx.body = { error: (typeof err === "object" && err !== null && "message" in err) ? (err as any).message : "Internal Server Error" };
    ctx.app.emit("error", err, ctx);
  }
});
app.use(cors());
app.use(helmet());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

// Hello World fallback route
app.use(async (ctx) => {
  if (ctx.path === "/" && ctx.method === "GET") {
    ctx.body = "Hello World";
  }
});

const main = async () => {
  try {
    await onDatabaseConnect();
    console.log("Database is connected");

    app.listen(PORT,'0.0.0.0', () => {
      console.log(`Server started on port ${PORT}`);
    });
    // const user = await register({ username: "TestUser", password: "123456" });
    // console.log(user); // { id: 4, username: 'testuser' }

    //await createShortUrl({ url: "https://www.google.com", id: "12345" }, 1);

    // const result = await login({
    //   username: "testuser",
    //   password: "123456",
    // });

    // console.log("Login successful:", result);

    // const payload = await validateToken(result.token);
    // console.log("Decoded JWT payload:", payload);
  } catch (e) {
    if (e instanceof HttpError) {
      console.error(`Error: ${e.statusCode} - ${e.message}`);
    } else {
      console.error("Unexpected error", e);
    }
  }
};

main();

const swaggerRouter = new Router();

// Serve Swagger JSON
swaggerRouter.get("/swagger.json", async (ctx) => {
  ctx.body = swaggerSpec;
});

// Serve Swagger UI
app.use(
  koaSwagger({
    routePrefix: "/docs", // Swagger UI at http://localhost:3000/docs
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

app.use(swaggerRouter.routes()).use(swaggerRouter.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());

// onDatabaseConnect()
//   .then(() => {
//     console.log("Database is connected");
//     // You can start your app here
//   })
//   .catch((e) => {
//     console.error("Error with database connection");
//     console.error(e);
//   });

// async function main() {
//   try {
//     // SELECT all users
//     const allUsers = await knex("users").select("*");
//     const users = await knex("users").select("*");
//     console.log("All users:", users);

//     // SELECT user by ID
//     const user = await knex("users").where({ id: 1 }).first();
//     console.log("Single user:", user);

//     // INSERT user
//     const newUser = await knex("users")
//       .insert({ username: "test5", password: "test" })
//       .returning("*");
//     console.log("Inserted user:", newUser);

//     // INSERT URL
//     const newUrl = await knex("urls")
//       .insert({ url: "https://google.com", user_id: 1 })
//       .returning("*");
//     console.log("Inserted URL:", newUrl);

//     // DELETE URL
//     await knex("urls").where({ id: newUrl[0].id }).del();
//     console.log("Deleted URL with id:", newUrl[0].id);

//     // SELECT URLs
//     const urls = await knex("urls").select("*");
//     console.log("All URLs:", urls);

//     // DELETE user
//     const deletedUser = await knex("users")
//       .where({ username: "test3" })
//       .del()
//       .returning("*");

//     console.log("Deleted user:", deletedUser);

//     await onDatabaseConnect();
//     console.log("Database is connected");
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// main();
