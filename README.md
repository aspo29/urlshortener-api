# urlshortener-api

This is a URL Shortener API built using **TypeScript**, **PostgreSQL**, **Koa.js**, following **REST** principles and the **MVC** architecture.

---

## Features

- Shorten URLs
- RESTful API endpoints
- Secure with environment variables
- PostgreSQL database integration
- Written in TypeScript for type safety

## 🚀 Deployment

### 🐳 Local Docker Setup

1. **Build the Docker image:**

   ```bash
   docker build -t urlshortener-api .
   ```

2. **Run the container with environment variables:**

   ```bash
   docker run --env-file .env -p 3000:3000 urlshortener-api
   ```

3. **Access the API locally at:**

   ```
   http://localhost:3000
   ```

---

### 🌐 Live API on Render

The API is deployed and live on Render at:

🔗 **Base URL:**
```
https://urlshortener-api-8df1.onrender.com
```

📄 **Swagger Documentation:**
```
https://urlshortener-api-8df1.onrender.com/docs
```

You can use this live API in your frontend projects like **Next.js**, **Vue/Nuxt**, or **SvelteKit** by making HTTP requests to the endpoints exposed by the backend.

---

## 🧪 Using the API in Frontend Apps

Example: Call the API from your Next.js or Vue app:

```ts
// Next.js or Vue (Axios or Fetch)
fetch("https://urlshortener-api-8df1.onrender.com/api/shorten", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ originalUrl: "https://example.com" }),
})
  .then(res => res.json())
  .then(data => console.log(data.shortenedUrl));
```

---

## 🛠 Frontend Scaffold Idea

You can build a modern frontend (e.g., using **Next.js**, **Nuxt**, or **SvelteKit**) to interact with this API. A scaffold could include:

- URL input form
- Shorten button → sends `POST` request to `/api/shorten`
- Shows the shortened URL
- Redirect handler that opens original URL

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

