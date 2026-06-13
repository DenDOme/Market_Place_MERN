# API Gateway

## Overview

The **API Gateway** is the single entry point for all client requests in the marketplace system. It routes incoming HTTP requests to the appropriate microservices, enforces security policies, and handles rate limiting to protect the system from abuse.

---

## Responsibilities

- **Request routing** — forwards incoming API calls to the correct microservice based on the route key
- **Authentication & authorization** — validates JWT tokens and checks user roles before allowing access to protected routes
- **Security hardening** — applies HTTP security headers and CORS policies
- **Rate limiting** — prevents DDoS attacks by throttling excessive requests
- **Error handling & logging** — catches errors and returns proper HTTP status codes to the client

---

## How Routing Works

All requests follow this pattern:

```
http://{gateway_host}/api/{serviceKey}/{remainingPath}
```

- `serviceKey` — identifies which microservice should handle the request (e.g. `auth`, `products`, `orders`)
- `remainingPath` — the rest of the original request path forwarded to that service

The gateway uses `redirectMiddleware` internally to resolve and proxy the request.

---

## Tech Stack

| Package | Purpose |
|---|---|
| `Express.js` | HTTP server and routing |
| `axios` | Proxying requests to downstream services |
| `helmet` | Securing HTTP response headers |
| `cors` | Cross-origin request policy |
| `express-rate-limit` | Rate limiting / DDoS protection |
| `cookie-parser` | Parsing JWT from cookies |
| `dotenv` | Environment variable management |

---

## Middleware

- `authenticateUser` — verifies the JWT token on incoming requests
- `checkUserRole` — restricts access to certain routes based on the user's role (e.g. admin-only routes)
- `redirectMiddleware` — resolves the target service and proxies the request

---

## Running the Service

```bash
cd backend/APIGateway
cp .env.example .env   # fill in your values
npm install
npm run start
```

Default port: `4003`

---

## Environment Variables

```env
PORT=4003
JWT_SECRET=your_jwt_secret
AUTH_SERVICE_URL=http://localhost:4000
PRODUCT_SERVICE_URL=http://localhost:4002
ORDER_SERVICE_URL=http://localhost:4001
```
