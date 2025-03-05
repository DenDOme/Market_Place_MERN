import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import { connectRabbitMQ } from "./lib/rabbitmq.js";

import productRoutes from "./routes/product.route.js";
import categoryRoutes from "./routes/category.route.js";
import favouriteRoutes from "./routes/favourite.route.js";
import reviewRoutes from "./routes/review.route.js";
import userActionRoutes from "./routes/userAction.route.js";

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

app.use("/product-service/product", productRoutes);
app.use("/product-service/category", categoryRoutes);
app.use("/product-service/favourite", favouriteRoutes);
app.use("/product-service/review", reviewRoutes);
app.use("/product-service/user-action", userActionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
  connectRabbitMQ();
});
