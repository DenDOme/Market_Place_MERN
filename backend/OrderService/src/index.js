import express from "express";
import dotenv from "dotenv";

import cors from "cors";

import { connectDB } from "./lib/db.js";
import { connectRabbitMQ } from "../src/lib/rabbitmq.js";

import orderRoutes from "./routes/order.route.js";
import cartRouter from "./routes/cart.route.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/order-service/order", orderRoutes);
app.use("/order-service/cart", cartRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
  connectRabbitMQ();
});
