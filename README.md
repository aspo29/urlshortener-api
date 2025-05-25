# urlshortener-api

This is a URL Shortener API built using **TypeScript**, **PostgreSQL**, **Koa.js**, following **REST** principles and the **MVC** architecture.

---

## Features

- Shorten URLs
- RESTful API endpoints
- Secure with environment variables
- PostgreSQL database integration
- Written in TypeScript for type safety

---

## Deployment

### Local Docker Setup

1. Build the Docker image:

   ```bash
   docker build -t koa-app .
   ```

2. Run the Docker container with environment variables:

   ```bash
   docker run --env-file .env -p 3000:3000 koa-app
   ```

3. Access the API at: http://localhost:3000

---

### Deployment on Render

1. Push your code to GitHub.

2. Log into [Render](https://render.com) and create a new **Web Service**.

3. Connect your GitHub repository: https://github.com/aspo29/urlshortener-api.git

4. In the Render service settings:

   - Build Command: `npm install && npm run build`
   - Start Command: `node build/index.js`
   - Environment: Set your environment variables (same as in your .env)

5. Deploy and wait for Render to build and start your app.

---

## Environment Variables

Make sure to set these in your  file or Render environment settings:

- DB_PORT
- DB_HOST
- DB_DATABASE
- DB_USER
- DB_PASSWORD
- DATABASE_URL

---

## License

MIT License

