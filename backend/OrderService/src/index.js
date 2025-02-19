import express from "express";
import dotenv from "dotenv";
import path from "path";

import cors from "cors";

import { connectDB } from "./lib/db.js";
import { connectRabbitMQ } from "../src/lib/rabbitmq.js";

import orderRoutes from "./routes/order.route.js";
import cartRouter from "./routes/cart.route.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http:localhost:3000",
    credentials: true,
  })
);

app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
  connectRabbitMQ();
});
