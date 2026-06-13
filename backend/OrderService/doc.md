# Order Service

## Overview

**OrderService** handles all order processing and shopping cart management in the marketplace. It creates and tracks orders, manages cart state per user, and communicates with ProductService via RabbitMQ to keep product data up to date. MongoDB is used for persistent storage and Redis is used for caching product data to improve response times.

---

## Responsibilities

- **Order management** — create, update, retrieve, and delete orders; all state is persisted in MongoDB
- **Cart management** — add/remove items from a user's cart; cart is cleared when an order is placed
- **Order status tracking** — supports the following statuses: `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`
- **Inter-service sync via RabbitMQ** — listens for product update/delete events from ProductService to invalidate or update cached product data
- **Redis caching** — product data received from RabbitMQ is cached in Redis to reduce database calls and speed up cart/order operations
- **Error handling & data integrity** — uses proper error handling and transactional logic to prevent data corruption on failures

---

## Tech Stack

| Package | Purpose |
|---|---|
| `Express.js` | HTTP server and REST API |
| `MongoDB` + `Mongoose` | Order and cart data storage |
| `RabbitMQ` | Async messaging with ProductService |
| `Redis` | Caching product data for fast access |
| `dotenv` | Environment configuration |

---

## API Endpoints

| Method | Route | Description | Auth Required |
|---|---|---|---|
| `GET` | `/orders` | Get all orders for the current user | Yes |
| `GET` | `/orders/:id` | Get a single order by ID | Yes |
| `POST` | `/orders` | Place a new order | Yes |
| `PUT` | `/orders/:id/status` | Update order status | Yes (Admin) |
| `DELETE` | `/orders/:id` | Cancel/delete an order | Yes |
| `GET` | `/cart` | Get current user's cart | Yes |
| `POST` | `/cart` | Add an item to the cart | Yes |
| `DELETE` | `/cart/:itemId` | Remove an item from the cart | Yes |
| `DELETE` | `/cart` | Clear the entire cart | Yes |

---

## Order Status Flow

```
Pending → Processing → Shipped → Delivered
                    ↘
                   Cancelled
```

---

## RabbitMQ Events

| Event | Direction | Description |
|---|---|---|
| `product.updated` | Consumed | Updates cached product data in Redis |
| `product.deleted` | Consumed | Removes product from Redis cache |

---

## Running the Service

```bash
cd backend/OrderService
cp .env.example .env   # fill in your values
npm install
npm run start
```

Default port: `4001`

---

## Environment Variables

```env
PORT=4001
MONGO_URI=mongodb://localhost:27017/orders
RABBITMQ_URL=amqp://localhost
REDIS_URL=redis://localhost:6379
```
