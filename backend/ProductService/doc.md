# Product Service

## Overview

**ProductService** manages all product-related data in the marketplace. It handles creating, updating, and retrieving products, organizing them into categories, storing product images via Cloudinary, and publishing/consuming events through RabbitMQ to stay in sync with other services.

---

## Responsibilities

- **Product CRUD** — create, update, delete, and retrieve products; each product stores name, description, price, quantity, category, and images
- **Category management** — products are assigned to categories, making filtering and search more organized
- **Product recommendations** — generates personalized product suggestions based on user preferences and purchase history
- **Data synchronization via RabbitMQ** — publishes product change events (price updates, availability) so other services (e.g. OrderService) can stay up to date
- **Image storage via Cloudinary** — all product images are uploaded to and served from Cloudinary for fast, reliable delivery

---

## Tech Stack

| Package | Purpose |
|---|---|
| `Express.js` | HTTP server and REST API |
| `MongoDB` + `Mongoose` | Product and category data storage |
| `RabbitMQ` | Async messaging with other services |
| `Cloudinary` | Product image upload and storage |
| `dotenv` | Environment configuration |

---

## API Endpoints

| Method | Route | Description | Auth Required |
|---|---|---|---|
| `GET` | `/products` | Get all products | No |
| `GET` | `/products/:id` | Get a single product by ID | No |
| `POST` | `/products` | Create a new product | Yes (Admin) |
| `PUT` | `/products/:id` | Update product details | Yes (Admin) |
| `DELETE` | `/products/:id` | Delete a product | Yes (Admin) |
| `GET` | `/products/recommendations` | Get personalized recommendations | Yes |
| `GET` | `/categories` | Get all categories | No |

---

## RabbitMQ Events

| Event | Direction | Description |
|---|---|---|
| `product.updated` | Published | Notifies other services when a product is changed |
| `product.deleted` | Published | Notifies other services when a product is removed |

---

## Running the Service

```bash
cd backend/ProductService
cp .env.example .env   # fill in your values
npm install
npm run start
```

Default port: `4002`

---

## Environment Variables

```env
PORT=4002
MONGO_URI=mongodb://localhost:27017/products
RABBITMQ_URL=amqp://localhost
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
